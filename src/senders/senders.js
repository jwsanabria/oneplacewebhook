const config = require('../config')
const request = require("request");
const client = require('twilio')(config.twilioAccountId, config.twilioAuthToken);


async function sendWhatsapp(body, from, to){
    var result = undefined;

    try {
        const message = await client.messages.create({
            body,
            from: from,
            to: to
        });
    
        console.log('Se envía mensaje por Twilio: ', message.sid);
        
        result = message.sid;
    } catch (error) {
        console.log('Error al enviar mensaje en Twilio: ', error);
    }

    return result;
}


async function sendFacebook(body, from, to){
    var result = undefined;

    try{
        // Capturamos los datos del que genera el evento y el mensaje 
        var senderID = to;
        var response = {
            "text": body
        }

        // Construcicon del cuerpo del mensaje
        let request_body = {
            "recipient": {
                "id": senderID
            },
            "message": response
        }

        // Enviar el requisito HTTP a la plataforma de messenger
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": config.facebookAccessToken },
            "method": "POST",
            "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    console.log('Mensaje enviado!')
                    console.log(res);
                    result = res;
                } else {
                    console.error("No se puedo enviar el mensaje:" + err);
                    throw err;
                }
            });
    }catch(error){
        console.log('Error al enviar mensaje en Facebook:', error)
        throw error;
    }

    return result;
}


module.exports = { sendWhatsapp, sendFacebook }