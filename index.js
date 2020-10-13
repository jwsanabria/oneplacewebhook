// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")

// Initialize express and define a port
const app = express()
const PORT = process.env.PORT || 8080;

var server = require('http').Server(app); 
var io = require('socket.io')(server); 

io.set('origins', '*:*'); 

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())


app.use(function(req, res, next) { 
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
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))


app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.status(200).send({ message: 'Get utilizado.' })
})

app.post("/hook", (req, res) => {
  console.log(req.body) // Call your action on the request here
  res.status(200).send({ message: 'Post recibido.' }) // Responding is important
})


io.on('connection', function (socket) { 
    socket.emit('news', { hello: 'world' }); 
    socket.on('my other event', function (data) { 
    console.log(data); 
    }); 
});