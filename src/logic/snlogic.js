
const config = require('../config');
const daoMongo = require('../services/MessageService');
const { sendWhatsapp, sendFacebook } = require('../services/SendersService');

//Estado: En desarrollo
//20201031 FB
//Esta función rebibe parámetros y basado en la red social, envía el mensaje por la API correspondiente.
//También persiste el mensaje en BD.
async function sendToSocialNetwork(Client, SocketId, Message, SocialNetwork) {
    var messageId = undefined;
    User = await daoMongo.getIdSocialNetwork(SocketId, SocialNetwork);
    //Notifica el mensaje según la red social
    console.log(Client + "+" + User + "+" + SocialNetwork);
    if (SocialNetwork == config.messageNetworkFacebook) {
        let msgIdFacebook = await sendFacebook(Message, User, Client);
        messageId = msgIdFacebook
    }
    else {
        let msgIdWhatsapp = await sendWhatsapp(Message, User, Client);
        messageId = msgIdWhatsapp;
    }

    if(messageId != undefined){
        console.log("Msg IN: " + Client);
        //Persiste el mensaje en BD
        const result = await daoMongo.createMessage(messageId, Client, User, Message, config.messageTypeOutbound, SocialNetwork); 
    }else{
        console.log('El mensaje no pudo ser enviado');
    }
}

module.exports = { sendToSocialNetwork }

