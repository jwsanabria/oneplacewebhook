require('dotenv').config()
const app = require('./server');
const http = require('http');
//const bodyParser = require('body-parser')
//const io = require('socket.io')(server);

var server = http.createServer(app);

require('./database');

const io = require('socket.io').listen(server);
//const io = require('socket.io')(server);
require('./sockets').connection(io);

const emitMessage = (message) => {
  io.sockets.emit('message', message)
  console.log('Se emite desde el back el mensaje: ' + JSON.stringify(message));
}

io.on('new-message', socket => { 
  console.log("socket entra");
  
  console.log('Se recibe mensaje desde el front: ' + JSON.stringify(socket));
});


// Start express on the defined port
server.listen(app.get('port'), () => console.log(`🚀 Server running on port ${app.get('port')}`))

module.exports = { emitMessage }