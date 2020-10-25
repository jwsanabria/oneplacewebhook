const mongoose = require('mongoose');
const { Schema } = mongoose;

const WhatsappNumberSchema = new Schema({
    UserId: {type: String, required: true},
    Number: {type: String, required: true}
});

module.exports = mongoose.model('WhatsappNumber', WhatsappNumberSchema)