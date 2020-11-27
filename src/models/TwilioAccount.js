const mongoose = require('mongoose');
const { Schema } = mongoose;

const TwilioAccountSchema = new Schema({
    ID: {type: String, required: true},
    TWILIO_ACCOUNT_ID: {type: String, required: true},
    TWILIO_AUTH_TOKEN: {type: String, required: true}
});

module.exports = mongoose.model('TwilioAccount', TwilioAccountSchema)