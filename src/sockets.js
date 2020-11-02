require('dotenv').config()

const { sendToSocialNetwork } = require('./logic/snlogic');
const config = require('./config');

const connection = (io) => {
    io.set('origins', '*:*');

    io.on('connection', socket => {
        console.log("socket ID:" + socket.id);        

        socket.on('message', messagejson => {
            console.log('Mensaje a enviar a red social: ', messagejson);
            //Enviar atributos y la siguiente función debería manejar la lógica del envío a las diferentes redes           
            var Client = messagejson.Client;
            var User = messagejson.User;
            var SocialNetwork = messagejson.SocialNetwork; 
            var SocialNetwork = messagejson.SocialNetwork; 
            sendToSocialNetwork(messagejson.Client, messagejson.User, messagejson.Message, messagejson.SocialNetwork); 
        });
    });

}

module.exports = { connection }