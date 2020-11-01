
const config = require('../config');
const daoMongo = require('../whatsapp/wsroutine');
const { sendWhatsapp } = require('../twilio/senders');

//Estado: En desarrollo
//20201031 FB
//Esta función rebibe parámetros y basado en la red social, envía el mensaje por la API correspondiente.
//También persiste el mensaje en BD.
async function sendToSocialNetwork(Client, User, Message, SocialNetwork) {
    //Notifica el mensaje según la red social
    if (SocialNetwork == config.messageTypeFacebook) {

    }
    else {
        let result = sendWhatsapp(Message, User, Client);
    }

    let SmsMessageSid = '123'; //TODO: El ID debe provenir de la respuesta del API de la red social

    //Persiste el mensaje en BD
    const result = await daoMongo.createMessage(SmsMessageSid, Client, User, Message, 1, SocialNetwork); //TODO: Debería haber una enumeración para el tipo de mensaje.

    /*
    try {
        const message = await client.messages.create({
            body,
            from: 'whatsapp:' + config.twilioNumeroEmprendedor,
            to: 'whatsapp:' + config.twilioNumeroCliente
        });

        console.log(message.sid);
    } catch (error) {
        console.log(error);
    }
    */
}

module.exports = { sendToSocialNetwork }

