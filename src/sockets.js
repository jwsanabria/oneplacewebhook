const {sendWhatsapp} = require('./twilio/senders');

const connection = (io) => {
    io.set('origins', '*:*'); 

    io.on('connection', socket => { 
        console.log("socket ID:" + socket.id);
        //Send a message after a timeout of 4seconds
        setTimeout(function() {
            socket.send('Sent a message 4seconds after connection!');
        }, 4000);

        socket.on('message', data => sendWhatsapp(data));
    });

}


module.exports = {connection}