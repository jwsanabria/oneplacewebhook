
const config = require('../config');
const daoMongo = require('../services/MessageService');
const { sendWhatsapp, sendFacebook } = require('../services/SendersService');

//Estado: En desarrollo
//20201031 FB
//Esta función rebibe parámetros y basado en la red social, envía el mensaje por la API correspondiente.
//También persiste el mensaje en BD.
async function sendToSocialNetwork(Client, SocketId, Message, SocialNetwork) {
    let messageId = undefined;
    let account = await daoMongo.getAccountBySocketId(SocketId);
    
    //Notifica el mensaje según la red social
    console.log("sendToSocialNetwork: " + Client + ", " + account + ", " + SocialNetwork);

    let objRespuesta = {
        "SmsMessageSid": "",
        "NumMedia": "",
        "SmsSid": "",
        "SmsStatus": "",
        "Body": Message,
        "To": Client,
        "NumSegments": "1",
        "MessageSid": "",
        "AccountSid": "",
        "From": User,
        "ApiVersion": ""
    }

    console.log("Objeto a emitir: " + JSON.stringify(objRespuesta));

    
    
    if (SocialNetwork == config.messageNetworkFacebook) {
        sendFacebook(Message, account.FacebookId, Client, account.FacebookAccessToken, async (messageId) => {
            const result = await daoMongo.createMessage(messageId, Client, account.FacebookId, Message, config.messageTypeOutbound, SocialNetwork, null);
            require('../index').emitMessage(objRespuesta, SocketId);
            console.log("Objeto a emitir en FB (SocketId, JSON)): " + SocketId + ", " + JSON.stringify(objRespuesta));
        });
    }
    else {
        
        messageId = await sendWhatsapp(Message, account.WhatsappId, Client, account.TWILIO_ACCOUNT_ID, account.TWILIO_AUTH_TOKEN);

        if (messageId != undefined) {
            console.log("Msg IN: " + Client);

            //Persiste el mensaje en BD
            const result = await daoMongo.createMessage(messageId, account.WhatsappId, User, Message, config.messageTypeOutbound, SocialNetwork, account.TWILIO_ACCOUNT_ID);
            require('../index').emitMessage(objRespuesta, SocketId);
            console.log("Objeto a emitir en WA (SocketId, JSON)): " + SocketId + ", " + JSON.stringify(objRespuesta));
        } else {
            console.log('El mensaje no pudo ser enviado, no emitió mensaje a Twilio');
        }
    }
}

module.exports = { sendToSocialNetwork }

