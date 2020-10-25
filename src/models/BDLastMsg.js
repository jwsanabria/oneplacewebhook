const mongoose = require('mongoose');
const { Schema } = mongoose;

const WhatsappLastMsgSchema = new Schema({
    MessageSid: {type: String, required: true},
    To: {type: String, required: true},
    From: {type: String, required: true},    
    Body: {type: String, required: true}, 
    Owner: {type: Number, required: true}, 
    Hour: {type: Date, default: Date.now}
});

module.exports = mongoose.model('WhatsappLastMsg', WhatsappLastMsgSchema)