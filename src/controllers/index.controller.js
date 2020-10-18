const MessagingResponse = require('twilio').twiml.MessagingResponse;
const config = require('../config');
var request = require("request");

const indexController = (req, res) =>{ 
    res.render('index');
}

const chatController = (req, res) => {
    res.render('chat');
}

const receivedWhatsapp = (req, res) => {
    console.log('webhook');
    console.log('JSON.stringify(req.body): ' + JSON.stringify(req.body));
    console.log('req.body: ' + JSON.parse(JSON.stringify(req.body)).Body);
  
    const twiml = new MessagingResponse();
    twiml.message('You said: HOLA');
    require('../index').emitMessage(JSON.parse(JSON.stringify(req.body)).Body);
  
    res.status(200).send({
      body: twiml.toString(),
      headers: { 'Content-Type': 'application/xml' },
      isRaw: true
    });
  }


const getHookFacebook = (req, res) => {
    // Verificar la coincidendia del token
    if (req.query["hub.verify_token"] === config.facebookVerificationToken) {
        // Mensaje de exito y envio del token requerido
        console.log("webhook verificado!");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        // Mensaje de fallo
        console.error("La verificacion ha fallado, porque los tokens no coinciden");
        res.sendStatus(403);
    }
}


const postHookFacebook = (req, res) => {
    // Verificar si el evento proviene del pagina asociada
    if (req.body.object == "page") {
        console.log(req.body);
        // Si existe multiples entradas entradas
        req.body.entry.forEach(function(entry) {
            // Iterara todos lo eventos capturados
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    process_event(event);
                }
            });
        });
        res.sendStatus(200);
    }
}


// Funcion donde se procesara el evento
function process_event(event){
    // Capturamos los datos del que genera el evento y el mensaje 
    var senderID = event.sender.id;
    var message = event.message;
    
    // Si en el evento existe un mensaje de tipo texto
    if(message.text){
        // Crear un payload para un simple mensaje de texto
        var response = {
            "text": 'Enviaste este mensaje: ' + message.text
        }
    }
    
    // Enviamos el mensaje mediante SendAPI
    enviar_texto(senderID, response);
}


// Funcion donde el chat respondera usando SendAPI
function enviar_texto(senderID, response){
    // Construcicon del cuerpo del mensaje
    let request_body = {
        "recipient": {
          "id": senderID
        },
        "message": response
    }
    
    // Enviar el requisito HTTP a la plataforma de messenger
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": config.facebookAccessToken },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
          console.log('Mensaje enviado!')
        } else {
          console.error("No se puedo enviar el mensaje:" + err);
        }
    }); 
}

module.exports = {indexController, chatController, receivedWhatsapp, getHookFacebook, postHookFacebook}


