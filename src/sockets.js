const socketIO = require('socket.io');

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
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+573164911001'
        }).then(message => console.log(message.sid));
        }); 
    });


}

module.exports = {connection}