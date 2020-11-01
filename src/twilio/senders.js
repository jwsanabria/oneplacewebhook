const config = require('../config')
//const client = require('twilio')(config.twilioAccountId, config.twilioAuthToken);
const client = require('twilio')('AC120ae56b1e8dab9d33a1a2eb79a5d291', '46e9477e775a67a1721878f1a4143919'); //Cuenta FB

async function sendWhatsapp(body, from, to){
    try {
        const message = await client.messages.create({
            body,
            from: from,
            to: to
        });
    
        console.log('Se envía mensaje por Twilio: ', message.sid);
        //TODO: Devolver el ID del mensaje: message.sid
    } catch (error) {
        console.log('Error al enviar mensaje en Twilio: ', error);
    }
}

module.exports = { sendWhatsapp }