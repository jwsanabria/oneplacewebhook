
const config = require('../config');
const daoMongo = require('../services/MessageService');
const { sendWhatsapp, sendFacebook } = require('../services/SendersService');

//Estado: En desarrollo
//20201031 FB
//Esta función rebibe parámetros y basado en la red social, envía el mensaje por la API correspondiente.
//También persiste el mensaje en BD.
async function sendToSocialNetwork(Client, SocketId, Message, SocialNetwork) {
    let messageId = undefined;
    const account = await daoMongo.getAccountBySocketId(SocketId);
    const lastmessage = await daoMongo.getLastMessageByAccountIdAndClient(account.UserId, Client);
    console.log("ConversationName: " , lastmessage.ConversationName); 
    
    //Notifica el mensaje según la red social
    console.log("sendToSocialNetwork: " + Client + ", " + account + ", " + SocialNetwork);   
    
    let objRespuesta = {
        "MessageId": "",
        "Message": Message,        
        "Client": Client,  
        "User": "",      
        "ConversationName": lastmessage.ConversationName, 
		"SocialNetwork": parseInt(SocialNetwork), 
        "MessageType": config.messageTypeOutbound, 
        "Time": Date.now
    }  

    if (SocialNetwork == config.messageNetworkFacebook) {        
        console.log("Objeto a emitir: " + JSON.stringify(objRespuesta));
        sendFacebook(Message, account.FacebookId, Client, account.FacebookAccessToken, async (messageId) => {
            const result = await daoMongo.createMessage(messageId, Client, account.FacebookId, Message, config.messageTypeOutbound, SocialNetwork, null);            
            
            objRespuesta.MessageId = messageId;
            objRespuesta.User = account.FacebookId;                                    
            
            console.log("Objeto a emitir en FB (SocketId, JSON)): " + SocketId + ", " + JSON.stringify(objRespuesta));
            require('../index').emitMessage(objRespuesta, SocketId);
        });
    }
    else {
        
        messageId = await sendWhatsapp(Message, account.WhatsappId, Client, account.TWILIO_ACCOUNT_ID, account.TWILIO_AUTH_TOKEN);
        
        console.log("Objeto a emitir: " + JSON.stringify(objRespuesta));
        if (messageId != undefined) {
            console.log("Msg IN: " + Client);

            //Persiste el mensaje en BD
            const result = await daoMongo.createMessage(messageId, Client, account.WhatsappId, Message, config.messageTypeOutbound, SocialNetwork, account.TWILIO_ACCOUNT_ID);                       

            objRespuesta.MessageId = messageId;            
            objRespuesta.User = account.WhatsappId;                        

            console.log("Objeto a emitir en WA (SocketId, JSON)): " + SocketId + ", " + JSON.stringify(objRespuesta));
            require('../index').emitMessage(objRespuesta, SocketId);            
        } else {
            console.log('El mensaje no pudo ser enviado, no emitió mensaje a Twilio');
        }
    }
}

module.exports = { sendToSocialNetwork }

