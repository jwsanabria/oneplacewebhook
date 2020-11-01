const { sendToSocialNetwork } = require('./logic/snlogic');

const connection = (io) => {
    io.set('origins', '*:*');

    io.on('connection', socket => {
        console.log("socket ID:" + socket.id);

        //Send a message after a timeout of 4seconds
        /*
        setTimeout(function() {
            socket.send('Sent a message 4seconds after connection!');
        }, 4000);
        */

        socket.on('message', message => {
            console.log('Mensaje a enviar a red social: ', message);
            //Enviar atributos y la siguiente función debería manejar la lógica del envío a las diferentes redes            
            var Client = 'whatsapp:+573005559718';
            var User = 'whatsapp:+14155238886';
            var SocialNetwork = 2; //Simulando por el momento Whatsapp
            sendToSocialNetwork(Client, User, message, SocialNetwork); //TODO: Lógica para inferir SocialNetwork
        });
    });

}

module.exports = { connection }