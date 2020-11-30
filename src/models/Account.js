const mongoose = require('mongoose');
const { Schema } = mongoose;

const AccountSchema = new Schema({
    UserId: {type: String, required: true},
    WhatsappId: {type: String, required: true},
    FacebookId: {type: String, required: true},
    SocketId: {type: String},
    TWILIO_ACCOUNT_ID: {type: String, required: true},
    TWILIO_AUTH_TOKEN: {type: String, required: true},
    FacebookAccessToken: {type: String, required: true}
});

module.exports = mongoose.model('Account', AccountSchema)