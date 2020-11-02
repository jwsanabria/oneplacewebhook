
const config = require('../config');
const daoMongo = require('../whatsapp/wsroutine');
const { sendWhatsapp, sendFacebook } = require('../senders/senders');

//Estado: En desarrollo
//20201031 FB
//Esta función rebibe parámetros y basado en la red social, envía el mensaje por la API correspondiente.
//También persiste el mensaje en BD.
async function sendToSocialNetwork(Client, User, Message, SocialNetwork) {
    var messageId = undefined;
    //Notifica el mensaje según la red social
    if (SocialNetwork == config.messageNetworkFacebook) {
        let msgIdFacebook = await sendFacebook(Message, User, Client);
        messageId = msgIdFacebook
    }
    else {
        let msgIdWhatsapp = await sendWhatsapp(Message, User, Client);
        messageId = msgIdWhatsapp;
    }

    if(messageId != undefined){
        //Persiste el mensaje en BD
        const result = await daoMongo.createMessage(messageId, Client, User, Message, config.messageTypeOutbound, SocialNetwork); 
    }else{
        console.log('El mensaje no pudo ser enviado');
    }
}

module.exports = { sendToSocialNetwork }

