const mongoose = require('mongoose');
const { Schema } = mongoose;

const WhastappMsgSchema = new Schema({
    MessageSid: {type: String, required: true},
    To: {type: String, required: true},
    From: {type: String, required: true},
    Body: {type: String, required: true},
    Owner: {type: Number, required: true}, //1-From, 2-To.
    Hour: {type: Date, default: Date.now}
});

/*
const WhatsappUserAccountSchema = new Schema({
    UserId: {type: String, required: true},
    AccountType: {type: Number, required: true}, //1-WS, 2-FB
    AccountId: {type: String, required: true}
});
*/
module.exports = mongoose.model('WhastappMsg', WhastappMsgSchema);
//module.exports = mongoose.model('WhatsappUserAccount', WhatsappUserAccountSchema);