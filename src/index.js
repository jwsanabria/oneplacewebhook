require('dotenv').config()
const app = require('./server');
const http = require('http');
//const bodyParser = require('body-parser')

var server = http.createServer(app);

require('./database');

const io = require('socket.io').listen(server);
require('./sockets').connection(io);

const emitMessage = (message) => {
  io.sockets.emit('message', message)
  console.log('Se emite desde el back el mensaje: ' + JSON.stringify(message));
}

// Start express on the defined port
server.listen(app.get('port'), () => console.log(`🚀 Server running on port ${app.get('port')}`))

module.exports = { emitMessage }