const { MediaInstance } = require('twilio/lib/rest/api/v2010/account/message/media');
const BDWhatsapp = require('../models/BDWhatsapp');
const LastMessage = require('../models/LastMessage');
const mongoose = require('mongoose');
const conn = require('../database');
const Account = require('../models/Account');
const BDMessage = require('../models/Message');
const { ExportCustomJobPage } = require('twilio/lib/rest/bulkexports/v1/export/exportCustomJob');
const config = require('../config');

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

//
//Busca en la tabla de cuentas por usuario qué cuentas (número de whatsapp) le pertenecen. Solo trae un registro.
//Retorna json.
async function getWSUserAccounts(UserId) {
    return new Promise((resolve, reject) => {
        BDNumbersByUser.findOne({ UserId: UserId }, function (err, docs) {
            if (err) {
                console.log("getWSUserAccounts error: ", err);
                reject(JSON.stringify(''));
            }
            else {
                let resp = JSON.stringify(docs);
                console.log("getWSUserAccounts respuesta: ", resp);
                resolve(resp);
            }
        });
    });
}

//
//Muestra el último mensaje de cada cliente por Usuario. 
//Retorna json.
function getWSContactMSG_ByUser(From) {
    return new Promise((resolve, reject) => {
        let consulta = LastMessage.find({ From: From }, function (err, docs) {
            if (err) {
                console.log("getWSContactMSG_ByUser error: ", err);
                reject(JSON.stringify(''));
            }
        });

        consulta.then(docs => {
            let resp = JSON.stringify(docs);
            console.log("getWSContactMSG_ByUser respuesta: ", resp);
            resolve(resp);
        })
    });
}

//
//Se consulta la BD con esos dos parámetros, se ordena por fecha desc.
//Retorna json.
function getWSMessageByFromTo(From, To) {
    return new Promise((resolve, reject) => {
        let consulta = BDWhatsapp.find({ From: From, To: To }, function (err, docs) {
            if (err) {
                console.log("getWSMessageByFromTo error: ", err);
                reject(JSON.stringify(''));
            }
        }).sort({ Hour: -1 });

        consulta.then(docs => {
            let resp = JSON.stringify(docs);
            console.log("getWSMessageByFromTo respuesta: ", resp);
            resolve(resp);
        })
    });
}




/**
 * Guardar en la BD el mensaje que proviene de la interacción.
 * También guarda o actualiza en la tabla de Ultimos mensajes la última interacción que se tuvo con ese cliente.
 * Retorna true o false.
 * 
 * @param {*} UserId 
 * @param {*} MessageId 
 * @param {*} Client 
 * @param {*} User 
 * @param {*} Message 
 * @param {*} MessageType 
 * @param {*} SocialNetwork 
 */
async function createMessage(MessageId, Client, User, Message, MessageType, SocialNetwork){
    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
 
    try {
        const transactionResults = await session.withTransaction(async () => {
            var isAccount = undefined;
            if(SocialNetwork === config.messageTypeWhatsapp){
                isAccount = await Account.findOne({WhatsappId: User}, null, { session });
            }else{
                isAccount = await Account.findOne({FacebookId: User}, null, { session });
            }
            
            if(isAccount){
                const msg = await BDMessage.create([{UserId: isAccount.UserId, MessageId: MessageId, Client: Client, User: User, Message: Message, MessageType: MessageType, SocialNetwork: SocialNetwork}], { session });
                console.log(`${msg.createdCount} document created in the message collection ${msg}.`);

                const isLastMessage = await LastMessage.findOne(
                    { UserId:  isAccount.UserId, Client: Client, SocialNetwork: SocialNetwork},
                    null,
                    { session });
                if (isLastMessage) {
                    const lastMessageResults = await LastMessage.updateOne(
                        { UserId:  isAccount.UserId, Client: Client, SocialNetwork: SocialNetwork},
                        { $set: { Message: Message, MessageType: MessageType } },
                        { session });
                    console.log(`${lastMessageResults.matchedCount} document(s) found in the lastmessages collection with userd-client-socialnetwork ${ isAccount.UserId}-${Client}-${SocialNetwork}.`);
                    console.log(`${lastMessageResults.modifiedCount} document(s) was/were updated to include the message and message type.`);
                }else{
                    const lstmsg = await LastMessage.create([{UserId:  isAccount.UserId, MessageId: MessageId, Client: Client, User: User, Message: Message, MessageType: MessageType, SocialNetwork: SocialNetwork}], { session });
                    console.log(`${lstmsg.createdCount} document created in the lastmessage collection ${lstmsg}.`); 
                }
            }else{
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
    } catch(e){
        console.log("The transaction was aborted due to an unexpected error: " + e);
    } finally {
        await session.endSession();
    }    
}



function setMessage(UserId, MessageId, Client, User, Message, MessageType, SocialNetwork) {
    return new Promise((resolve, reject) => {
        //Crear el mensaje
        let mensaje = Message;
        mensaje.UserId = UserId;
        mensaje.MessageId = MessageId;
        mensaje.Client = Client;
        mensaje.User = User;
        mensaje.Message = Message;
        mensaje.MessageType = MessageType;
        mensaje.SocialNetwork = SocialNetwork;
        console.log(mensaje)
        mensaje.create(function (err) {
            if (err) {
                console.log("setMessage error en save: ", err);
                reject(err);
                resolve(false);
            }
            else {
                console.log("setMessage guardado correctamente")
                resolve(true); //TODO: Dejar en cascada para que la actualización en BD también vaya incluída en esta respuesta.
            }
        });

        ////Crear o actualizar el último mensaje
        //Buscar si ya existe
        let consulta = LastMessage.findOne({ UserId: UserId, From: Client, SocialNetwork: SocialNetwork}, function (err, res) {
            if (err) {
                console.log("lstMsg error: ", err);
                return false;
            }
            else {
                console.log("lstMsg res: ", res)

                if (res) {
                    let now = new Date();
                    console.log("lstMsg data a actualizar: Fecha " + now + ", id " + res._id + ", MessageSIDWS " + MessageId)

                    let ultMsgUpd = LastMessage.updateOne({ _id: res._id }, { MessageSid: MessageId, Hour: now, Message: Message, MessageType: MessageType}, function (errupd, resupd) {
                        console.log("ultMsUpd encontrado: ", ultMsgUpd);
                        if (errupd) {
                            console.log("error en lstMsg actualizar: ", errupd);
                            return false;
                        }
                        else {
                            console.log("actualiza registro lstMsg: ", resupd);
                            return true;
                        }
                    });
                }
                else {
                    let msgupd = new LastMessage();
                    msgupd.MessageSid = MessageId;
                    msgupd.User = User;
                    msgupd.Client = Client;
                    msgupd.Message = Message;
                    msgupd.MessageType = MessageType;
                    msgupd.SocialNetwork = SocialNetwork;
                    msgupd.UserId = UserId;

                    msgupd.save(function (err) {
                        if (err) {
                            console.log("Error en lstMsg save: ", err);
                            return false;
                        }
                        else {
                            console.log("Guardado lstMsg correctamente")
                            return true;
                        }
                    });
                }
            }
        });
    });
}


exports.getWSUserAccounts = getWSUserAccounts;
exports.getWSContactMSG_ByUser = getWSContactMSG_ByUser;
exports.getWSMessageByFromTo = getWSMessageByFromTo;
exports.setWSUserAccountNumber = setWSUserAccountNumber;
exports.createMessage = createMessage;
exports.setMessage = setMessage;
