require('dotenv').config()
const auth = require('../src/services/AuthService');
const daoMongo = require('../src/services/MessageService');

const { sendToSocialNetwork } = require('./logic/snlogic');
const config = require('./config');

const connection = async (io) => {
    io.set('origins', '*:*');

    io.use(function(socket, next){
        if (socket.handshake.query && socket.handshake.query.token){
            console.log('Token recibido desde el socket: ' + socket.handshake.query.token);
            auth.Validate(socket.handshake.query.token, function(error, valido, userId){
                console.log('Hay error? --> ' + error)
                if (error) return next(new Error('Authentication error'))                
                //Funcion para Actualizar o guardar el SocketId del usuario.
                daoMongo.setSocketIdByUserId(userId, socket.id);
                next();
            });          
        }
        else {
          next(new Error('Authentication error'));
        }    
      })
      .on('connection', socket => {
        console.log("socket ID:" + socket.id);        

        socket.on('message', messagejson => {
            console.log('Mensaje a enviar a red social: ', messagejson);
            //const objetcJson = JSON.parse(messagejson);
            const objetcJson = messagejson;
            //Enviar atributos y la siguiente función debería manejar la lógica del envío a las diferentes redes           
            sendToSocialNetwork(objetcJson.Client, socket.id, objetcJson.Message, objetcJson.SocialNetwork); 
        });
    });

}

module.exports = { connection }