const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
    UserId: {type: String, required: true}, //Id del usuario de la cuenta.
    MessageId: {type: String, required: true}, //Id del mensaje en Whatsapp.
    Client: {type: String, required: true}, //El cliente interesado en el producto.
    User: {type: String, required: true}, //El teléfono del usuario.
    Message: {type: String, required: true}, //Mensaje
    MessageType: {type: Number, required: true}, //De quién proviene ese mensaje: 1-Inbound, 2-Outbound.
    Time: {type: Date, default: Date.now}, //Hora de la interacción.
    SocialNetwork: {type: Number, required: true} //1. FB, 2. Whatsapp.
});

module.exports = mongoose.model('Message', MessageSchema)