const { MediaInstance } = require('twilio/lib/rest/api/v2010/account/message/media');
const BDWhatsapp = require('../models/BDWhatsapp');
const LastMessage = require('../models/LastMessage');
const mongoose = require('mongoose');
const conn = require('../database');
const Account = require('../models/Account');
const BDMessage = require('../models/Message');
const { ExportCustomJobPage } = require('twilio/lib/rest/bulkexports/v1/export/exportCustomJob');
const config = require('../config');
const TwilioAccount = require('../models/TwilioAccount');

//
//Crear en la tabla cuentas por usuario el IdUsuario de la aplicación y relacionarlo con un teléfono para whatsapp.
//No valida si ya se encuentra previamente.
//Retorna true o false.
function setWSUserAccountNumber(UserId, Number) {
    return new Promise((resolve, reject) => {
        //Crear el mensaje
        let mensaje = new BDNumbersByUser();
        mensaje.UserId = UserId;
        mensaje.Number = Number;
        console.log("WSUserAccountNumber a grabar: ", mensaje.toJSON())
        mensaje.save(function (err) {
            if (err) {
                console.log("WSUserAccountNumber error en save: ", err);
                reject(err);
                resolve(false);
            }
            else {
                console.log("WSUserAccountNumber: Guardado correctamente");
                resolve(true);
            }
        });
    });
}

/**
 * Guardar en la BD el mensaje que proviene de la interacción.
 * También guarda o actualiza en la tabla de Ultimos mensajes la última interacción que se tuvo con ese cliente.
 * Retorna true o false.
 * 
 * @param {*} MessageId 
 * @param {*} Client 
 * @param {*} User 
 * @param {*} Message 
 * @param {*} MessageType 
 * @param {*} SocialNetwork 
 */
async function createMessage(MessageId, Client, User, Message, MessageType, SocialNetwork, TWILIO_ACCOUNT_ID) {
    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        const transactionResults = await session.withTransaction(async () => {
            var isAccount = undefined;
            if (SocialNetwork == config.messageNetworkWhatsapp) {
                isAccount = await Account.findOne({ TWILIO_ACCOUNT_ID: TWILIO_ACCOUNT_ID }, null, { session });
            } else {
                isAccount = await Account.findOne({ FacebookId: User }, null, { session });
            }

            if (isAccount) {
                const msg = await BDMessage.create([{ UserId: isAccount.UserId, MessageId: MessageId, Client: Client, User: User, Message: Message, MessageType: MessageType, SocialNetwork: SocialNetwork }], { session });
                console.log(`${msg.length} document created in the message collection ${msg}.`);

                const isLastMessage = await LastMessage.findOne({ UserId: isAccount.UserId, Client: Client, SocialNetwork: SocialNetwork },
                    null,
                    { session });
                if (isLastMessage) {
                    const lastMessageResults = await LastMessage.updateOne(
                        { UserId: isAccount.UserId, Client: Client, SocialNetwork: SocialNetwork },
                        { $set: { Message: Message, MessageType: MessageType } },
                        { session });
                    console.log(`Document found in the lastmessages collection with userid-client-socialnetwork ${isAccount.UserId}-${Client}-${SocialNetwork}.`);
                    console.log(`Document was/were updated to include the message and message type.`);
                } else {
                    try {
                        const lstmsg = await LastMessage.create([{ UserId: isAccount.UserId, MessageId: MessageId, Client: Client, User: User, Message: Message, MessageType: MessageType, SocialNetwork: SocialNetwork }], { session });
                        console.log(`${lstmsg.length} document created in the lastmessage collection ${lstmsg}.`);
                    }
                    catch (error) {
                        console.log('Error in LastMessage: ' + error);
                        await session.abortTransaction();
                        console.error("Account is not found. The message could not be created. By Try.");
                        console.error("Any operations that already occurred as part of this transaction will be rolled back. By Try");
                        return;
                    }

                }
            } else {
                await session.abortTransaction();
                console.error("Account is not found. The message could not be created.");
                console.error("Any operations that already occurred as part of this transaction will be rolled back.");
                return;
            }


        }, transactionOptions);

        if (transactionResults) {
            console.log("The message was successfully created.");
        } else {
            console.log("The transaction was intentionally aborted.");
        }
    } catch (e) {
        console.log("The transaction was aborted due to an unexpected error: " + e);
    } finally {
        await session.endSession();
    }
}


/**
 * Obtiene la lista de contactos de una cuenta con el ultimo mensaje en la conversación de cada uno.
 * 
 * @param {*} UserId 
 */
async function getContacts(UserId) {

    const lastMessages = await LastMessage.find({ UserId: UserId }).sort({ Time: -1 });

    return lastMessages;
}


/**
 * Crea una cuenta con el nombre de usuario y numero de telefono
 * @param {*} UserId 
 * @param {*} WhatsappId 
 */
async function verifyAccount(UserId, WhatsappId) {
    var isAccount = await Account.findOne({ UserId: UserId });

    if (!isAccount) {
        const account = await Account.create([{ UserId: UserId, WhatsappId: "whatsapp:" + WhatsappId, FacebookId: "Vacio", FacebookAccessToken: "configAccessToken", TWILIO_ACCOUNT_ID: "configTwilioID", TWILIO_AUTH_TOKEN: "confiTwilioToken" }]);
    }
}


/**
 * Obtiene la lista de mensajes de una cuenta con un cliente específico y en una red social definida,
 * se utiliza para cargar el contenido de una conversación seleccionada.
 * 
 * @param {*} User 
 * @param {*} Client 
 * @param {*} SocialNetwork 
 */
async function getMessagesByClient(User, Client, SocialNetwork) {
    const messages = await BDMessage.find({ User: User, Client: Client, SocialNetwork: SocialNetwork }).sort({ Time: 1 });

    return messages;
}


/**
 * Devuelve el socketId de una conexión por tipo de red social
 * @param {*} idNetwork 
 * @param {*} SocialNetwork 
 */
async function getSocketId(idNetwork, SocialNetwork) {
    var account = undefined;
    if (SocialNetwork == config.messageNetworkFacebook) {
        account = await Account.findOne({ FacebookId: idNetwork });
    } else {
        account = await Account.findOne({ TWILIO_ACCOUNT_ID: idNetwork });
    }

    return account.SocketId;
}

async function setSocketIdByUserId(UserId, SocketId) {
    const accountResults = await Account.updateOne(
        { UserId: UserId },
        { $set: { SocketId: SocketId } }
    );
}

async function getIdSocialNetwork(socketId, SocialNetwork) {
    var userMessageAccount = undefined;
    if (SocialNetwork == config.messageNetworkFacebook) {
        const account = await Account.findOne({ SocketId: socketId });
        userMessageAccount = account.FacebookId;
    } else {
        const account = await Account.findOne({ SocketId: socketId });
        userMessageAccount = account.WhatsappId;
    }

    return userMessageAccount;
}

/**
 * Crea una cuenta con el nombre de usuario y numero de telefono
 * @param {*} SocketId 
 */
async function getAccountBySocketId(SocketId) {
    return await Account.findOne({ SocketId: SocketId });
}

/**
 * Obtiene los datos de un usuario.
 * 
 * @param {*} UserId 
 */
async function getAccount(UserId) {
    var isAccount = await Account.findOne({ UserId: UserId });
    return isAccount;
}


async function setConversationNameByUserId(UserId, Client, ConversationName) {
    const isLastMessage = await LastMessage.findOne({ UserId: UserId, Client: Client });

    if (isLastMessage) {
        const lastMessageResults = await LastMessage.updateOne(
            { UserId: UserId, Client: Client },
            { $set: { ConversationName: ConversationName } }
        );
    }
}

exports.createMessage = createMessage;
exports.getContacts = getContacts;
exports.getMessagesByClient = getMessagesByClient;
exports.verifyAccount = verifyAccount;
exports.getSocketId = getSocketId;
exports.setSocketIdByUserId = setSocketIdByUserId;
exports.getIdSocialNetwork = getIdSocialNetwork;
exports.getAccountBySocketId = getAccountBySocketId;
exports.getAccount = getAccount;
exports.setConversationNameByUserId = setConversationNameByUserId;