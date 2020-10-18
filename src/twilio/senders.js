const config = require('../config')
const client = require('twilio')(config.twilioAccountId, config.twilioAuthToken);

async function sendWhatsapp(body){
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
}

module.exports = { sendWhatsapp }