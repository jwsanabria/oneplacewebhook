const socketIO = require('socket.io');
require('dotenv').config()

const connection = server => {
    const io = require('socket.io').listen(server); 

    io.set('origins', '*:*'); 

    const accountSid = process.env.TWILIO_ACCOUNT_ID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    io.on('connection', socket => { 
        console.log("socket ID:" + socket.id);
        //Send a message after a timeout of 4seconds
        setTimeout(function() {
            socket.send('Sent a message 4seconds after connection!');
        }, 4000);

        socket.on('message', function (data) { 
            client.messages.create({
            body: data,
            from: 'whatsapp:' + process.env.NUM_EMPRENDEDOR,
            to: 'whatsapp:' + process.env.NUM_CLIENTE
        }).then(message => console.log(message.sid));
        }); 
    });


}

module.exports = {connection}