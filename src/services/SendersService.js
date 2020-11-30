const config = require('../config')
const request = require("request");
//const client = require('twilio')(config.twilioAccountId, config.twilioAuthToken);

async function sendWhatsapp(body, from, to, twilioAccountId, twilioAuthToken) {
    var result = undefined;

    const client = require('twilio')(twilioAccountId, twilioAuthToken);

    try {
        const message = await client.messages.create({
            body,
            from: from,
            to: to
        });

        console.log('Se envía mensaje por Twilio: ' + twilioAccountId + ' msgId: ' + message.sid);

        result = message.sid;
    } catch (error) {
        console.log('Error al enviar mensaje en Twilio: ', error);
    }

    return result;
}

async function sendFacebook(body, from, to, facebookAccessToken, callback) {
    console.log("FacebookAccessToken:::" + facebookAccessToken);
    try {
        // Capturamos los datos del que genera el evento y el mensaje 
        var senderID = to;
        var response = {
            "text": body
        }

        console.log("Msg Out: " + to);

        // Construcicon del cuerpo del mensaje
        let request_body = {
            "recipient": {
                "id": senderID
            },
            "message": response,
            "messaging_type": "MESSAGE_TAG",
            "tag": "ACCOUNT_UPDATE"
        }

        // Enviar el requisito HTTP a la plataforma de messenger
        request({
            "uri": "https://graph.facebook.com/v8.0/me/messages",
            "qs": { "access_token": facebookAccessToken },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                console.log('Mensaje enviado!')
                //console.log(res);
                callback(res.body.message_id);
            } else {
                console.error("No se puedo enviar el mensaje:" + err);
                throw err;
            }
        });
    } catch (error) {
        console.log('Error al enviar mensaje en Facebook:', error)
        throw error;
    }
}

module.exports = { sendWhatsapp, sendFacebook }