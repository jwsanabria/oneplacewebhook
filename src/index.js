require('dotenv').config()
const app = require('./server');
const http = require('http');
//const bodyParser = require('body-parser')

var server = http.createServer(app);

require('./database');

const io = require('socket.io').listen(server);
require('./sockets').connection(io);
//require('./sockets').connection(server);

const emitMessage = (message) => {
  io.sockets.emit('message', message)
}


const qs = require("querystring");
const MessagingResponse = require('twilio').twiml.MessagingResponse;


// Tell express to use body-parser's JSON parsing

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});


// Start express on the defined port
server.listen(app.get('port'), () => console.log(`🚀 Server running on port ${app.get('port')}`))


//app.use(bodyParser.json())
/*app.get("/chat3", (req, res) => {
  //res.status(200).send({ message: 'Get utilizado.' })
  res.sendFile("../index.html", { root: __dirname });
})


app.get("/chat4", (req, res) => {
  //res.status(200).send({ message: 'Get utilizado.' })
  res.sendFile("index2.html", { root: __dirname });
})*/






/*var clients = 0;
io.on('connection', function(socket) {
  console.log('A user connected');

  //Send a message when
  setTimeout(function() {
     //Sending an object when emmiting an event
     socket.emit('testerEvent', { description: 'A custom event named testerEvent!'});
  }, 4000);

  socket.on('clientEvent', function(data) {
    console.log(data);
 });

 clients++;
 io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
 socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
   socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
   socket.on('disconnect', function () {
      clients--;
      socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
   });
});*/

module.exports = { emitMessage }