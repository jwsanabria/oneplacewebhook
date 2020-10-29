const mongoose = require('mongoose');
const { Schema } = mongoose;

const AccountSchema = new Schema({
    UserId: {type: String, required: true},
    WhatsappId: {type: String, required: true},
    FacebookId: {type: String, required: true},
    SocketId: {type: String}
});

module.exports = mongoose.model('Account', AccountSchema)