const mongoose = require('mongoose');
const { Schema } = mongoose;

const WhatsappMsgSchema = new Schema({
    MessageSid: {type: String, required: true}, //Id del mensaje en Whatsapp.
    To: {type: String, required: true}, //El teléfono del cliente.
    From: {type: String, required: true}, //El teléfono del usuario.
    Body: {type: String, required: true}, //Mensaje
    Owner: {type: Number, required: true}, //De quién proviene ese mensaje: 1-From, 2-To.
    Hour: {type: Date, default: Date.now} //Hora de la interacción.
});

module.exports = mongoose.model('WhatsappMsg', WhatsappMsgSchema)