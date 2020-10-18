const MessagingResponse = require('twilio').twiml.MessagingResponse;

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


module.exports = {indexController, chatController, receivedWhatsapp}


