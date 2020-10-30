const {Schema, model} = require('mongoose');

const newSchema = new Schema ({
    message: {
        type: String,
        required: true
    },
    
    from: {
        type: String,
        required: true
    },

    to: {
        type: String,
        required: true
    }, 

    social_network: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = model('message', newSchema);