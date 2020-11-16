require('dotenv').config()
const app = require('./server');
const http = require('http');


var server = http.createServer(app);

require('./database');

const io = require('socket.io').listen(server);
require('./sockets').connection(io);

const emitMessage = (message, socketId) => {
  io.to(socketId).emit('message', message);
  console.log('Se emite desde el API de la red social el mensaje: ' + JSON.stringify(message) + ' con el socketId: ' + socketId);
}

// Start express on the defined port
server.listen(app.get('port'), () => console.log(`🚀 Server running on port ${app.get('port')}`))

module.exports = { emitMessage }