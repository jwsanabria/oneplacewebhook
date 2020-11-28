
const config = require('../config');
const daoMongo = require('../services/MessageService');
const { sendWhatsapp, sendFacebook } = require('../services/SendersService');

//Estado: En desarrollo
//20201031 FB
//Esta función rebibe parámetros y basado en la red social, envía el mensaje por la API correspondiente.
//También persiste el mensaje en BD.
async function sendToSocialNetwork(Client, SocketId, Message, SocialNetwork)
{
    let messageId = undefined;
    let User = await daoMongo.getIdSocialNetwork(SocketId, SocialNetwork);

    //Notifica el mensaje según la red social
    console.log(Client + "+" + User + "+" + SocialNetwork);

    if (SocialNetwork == config.messageNetworkFacebook) {
        sendFacebook(Message, User, Client, async (messageId) => {
            const result = await daoMongo.createMessage(messageId, Client, User, Message, config.messageTypeOutbound, SocialNetwork);
        });
    }
    else {
        let twilioAccount = await daoMongo.getTwilioAccount(SocketId);
        messageId = await sendWhatsapp(Message, User, Client, twilioAccount.TWILIO_ACCOUNT_ID, twilioAccount.TWILIO_AUTH_TOKEN);

        if (messageId != undefined) {
            console.log("Msg IN: " + Client);

            //Persiste el mensaje en BD
            const result = await daoMongo.createMessage(messageId, Client, User, Message, config.messageTypeOutbound, SocialNetwork);
        } else {
            console.log('El mensaje no pudo ser enviado');
        }
    }
}

module.exports = { sendToSocialNetwork }

