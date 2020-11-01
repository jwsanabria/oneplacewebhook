const MessagingResponse = require('twilio').twiml.MessagingResponse;
const config = require('../config');
const request = require("request");
const Message = require('../models/Message');
const whatsappBack = require('../whatsapp/wsroutine');
const Account = require('../models/Account');
const daoMongo = require('../whatsapp/wsroutine');


////////////////////////////
const accountSid = config.twilioAccountId;
const authToken = config.twilioAuthToken;
const client = require('twilio')(accountSid, authToken);
///////////////////////////

const indexController = (req, res) => {
    res.render('index');
}

const chatController = (req, res) => {
    res.render('chat');
}

require('../index').receiveMessage;
  

//FB
const chatController2 = (req, res) => {
    let userId = '555';
    let from1 = 'whatsapp:+573005559718';
    let to1 = 'whatsapp:+14155238886';
    let body1 = 'Mensaje';    
    let messageSid1 = '';

    //Enviar Mensaje a Twilio
    let results = client.messages
        .create({
            from: from1,
            body: body1,
            to: to1
        })
        .then(message => console.log('Mensaje enviado a Twilio: ', message.sid));

    //messageSid1 = resultws.sid; //TODO: No lo va a capturar, falta volverlo asincrono
    messageSid1='';

    //Guardar mensaje en BD.
    const resultSave = whatsappBack.setWSMessageByFromTo(messageSid1, body1, from1, to1, 1); //.then(function (msg1, msg2) { console.log(msg1) });



    res.render('chat');
}

//FB
//Carga todos los mensajes de los recientes la primera vez que carga la pagina
const LeftMessagesController = (req, res) => {
    //Obtener el usuario de la sesión
    let userId = req.params.user;
    if (!userId)
        userId = '555';

    userId = '555';

    //Obtener el número del usuario según el ID de la sesión
    whatsappBack.getWSUserAccounts(userId).then(function (resp, error) {
        if (error) {
            console.log('Se produjo un error en : WSService.getWSUserAccounts', error);
        }
        else {
            console.log(resp);
            //Recargar barra de Recientes con el número de teléfono asociado    
            whatsappBack.getWSContactMSG_ByUser(JSON.parse(resp).Number).then(function (msg1, msg2) {
                console.log('Data de WSService.getWSContactMSG_ByUser: ', msg1);
                //res.render('leftmessages', { msg1 });

                res.status(200).send(msg1);
            });
        }
    });
}

//Al seleccionar ese chat en la parte izquiera, carga todos los mensajes para ese contacto en la parte central
const ChatCargeController = (req, res) => {
    //Cargar todos los mensajes
    WSService.getWSMessageByFromTo('300123', '301234').then(function (msg1, msg2) { console.log(msg1) });

    res.render('index');
}



//FB: Modifiqué este por el que yo implementé.
const receivedWhatsapp1 = async (req, res) => {
    console.log('JSON.stringify(req.body): ' + JSON.stringify(req.body));
    console.log('req.body: ' + JSON.parse(JSON.stringify(req.body)).Body);

    const result = await Message.create({ message: JSON.parse(JSON.stringify(req.body)).Body, from: JSON.parse(JSON.stringify(req.body)).From, to: JSON.parse(JSON.stringify(req.body)).To, social_network: "whatsapp" });

    console.log(result.sid);

    const twiml = new MessagingResponse();
    twiml.message('You said: ' + JSON.parse(JSON.stringify(req.body)).Body);
    require('../index').emitMessage(JSON.parse(JSON.stringify(req.body)).Body);

    res.status(200).send({
        body: twiml.toString(),
        headers: { 'Content-Type': 'application/xml' },
        isRaw: true
    });
}

//Estado: En desarrollo
//20201029 FB.
//Recurso que captura los mensajes que provienen del API de Whatsapp.
const postHookWhatsapp = (req, res) => {
    //Captura el JSON y lo distribuye en variables
    body = JSON.parse(JSON.stringify(req.body));

    if (Object.keys(body).length === 0)
        res.status(500).send('error');
    else
    {
        SmsMessageSid = body.SmsMessageSid;
        Body = body.Body;
        To = body.To; //En este contexto, from es el Cliente
        From = body.From; //En este contexto, from es el Usuario
        //console.log('JSON.stringify(req.body): ' + JSON.stringify(req.body));
        //console.log('req.body: ' + JSON.parse(JSON.stringify(req.body)).Body);

        UserId = '2'; //TODO: Cuenta de usuario

        //Almacena el mensaje en la BD.
        //TODO: Esto debería ser asíncrono, para pintar rápidamente el mensaje en pantalla al usuario
        const result = MessagesBack.setMessage(UserId, SmsMessageSid, To, From, Body, 1, 2); //.then(function (msg1, msg2) { console.log(msg1) });

        //Emitir el mensaje por SocketIO
        require('../index').emitMessage(body);

        //devuelve ok al api. Este no valida un mensaje en específico, solo la respuesta 200 http
        res.status(200).send('ok');
    }           
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



/**
 * Controlador para el webhook de Facebook, este metodo consulta la cuenta del mensaje recibido, si la encuentra
 * realiza el registro del mensaje recibido asignándolo al usuario registrado en la aplicación y se realiza el 
 * envío de la notificación a través del socket io específico.
 * 
 * Se espera recibir la siguiente estructura y ejemplo de datos: 
 * {"object":"page", "entry":[{"id":"103063468342065", "time":1458692752478, "messaging":[{"sender":{ "id":"13235324321"},
 *  "recipient":{"id":"103063468342065"}, "message": "TEST_MESSAGE"}]}]}
 * 
 * @param {} req 
 * @param {*} res 
 */
const postHookFacebook = async (req, res) => {
    console.log('hookFacebook ' + req.body.object); 

    // Verificar si el evento proviene del pagina asociada
    if (req.body.object == "page") {
        // Si existe multiples entradas entradas
        for(const entry of req.body.entry){
            // Iterara todos lo eventos capturados
            for(const event of entry.messaging){
                if (event.message) {
                    const result = daoMongo.createMessage(event.sender.id, event.sender.id, event.recipient.id, event.message, 1,  config.messageTypeFacebook);

                    //TODO: Construir mensaje a emitir    
                    //require('../index').emitMessage(result);

                }else{
                    console.log('No hay cuenta registrada '+ event.recipient.id);
                }
            }
        }
        res.sendStatus(200);
    }
}


// Funcion donde se procesara el evento
function process_event(event, account) {
    // Capturamos los datos del que genera el evento y el mensaje 
    var senderID = event.sender.id;
    var message = event.message;

    // Si en el evento existe un mensaje de tipo texto
    if (message.text) {
        // Crear un payload para un simple mensaje de texto
        //const result = await Message.create({UserId: account[0].UserId, MessageId: event.sender.id, Client: event.sender.id, User: event.recipient.id, Message: event.message, MessageType: 1,  SocialNetwork: 1});
        /*var response = {
            "text": 'Enviaste este mensaje: ' + message.text
        }*/
    }

    // Enviamos el mensaje mediante SendAPI
    //enviar_texto(senderID, response);
}


// Funcion donde el chat respondera usando SendAPI
function enviar_texto(senderID, response) {
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

/**
 * Función para retornar el conjunto de contactos de una cuenta junto con el ultimo mensaje recibido
 * 
 * @param {*} req 
 * @param {*} res 
 */
const contactmessagesController = async (req, res) => {
    //TODO: Obtener el usuario de la sesión
    //Obtener el usuario de la sesión
    let userId = req.params.userid;
    if (!userId)
        userId = '555';
    userId = 'Oneplace1'; //! Se debe establecer el UserId desde el token

//Estado: En desarrollo
//20201029 FB.
//Recurso que expone todos los mensajes que un usuario ha tenido con un cliente.
//El request debería contener la red social de donde lo contacta, la cuenta de usuario y la cuenta del cliente.
const messagesController = (req, res) => {
    //Obtener los parámetros requeridos
    let socialnetwork = req.params.socialnetwork;
    let useraccountid = req.params.useraccountid;
    let clientaccountid = req.params.clientaccountid;

    if (!socialnetwork || !useraccountid || clientaccountid)
        res.status(200).send('{}');

    //Obtener los mensajes, según el ID del usuario
    whatsappBack.getWSMessageByFromTo(socialnetwork, useraccountid, clientaccountid).then(function (msg1, msg2) {
        if (msg2) {
            console.log('Error en messagesController para ' + socialnetwork + ', ' + useraccountid + ', ' + clientaccountid + ': ' + msg2);
            res.status(500).send(msg2);
        }
        else {
            console.log('Data de messagesController: ', msg1);
            res.status(200).send(msg1);
        }
    });

    /* Se comentarea mientras se resuelve el conflicto
    try{
        const contacts = await daoMongo.getContacts(userId);
        res.status(200).json(contacts);
    }catch(error){
        res.status(404).json({error:error.toString()});
    }
    */
}


const messagesController = async (req, res) => {
    //TODO: Obtener el usuario de la sesión
    userId = 'Oneplace1'; //! Se debe establecer el UserId desde el token
    
    clientId = req.body.clientId;
    socialNetwork = req.body.socialNetwork;

    try{
        const messages = await daoMongo.getMessagesByClient(userId, clientId, socialNetwork);
        res.status(200).json(messages);
    }catch(error){
        res.status(404).json({error:error.toString()});
    }
}

module.exports = { indexController, chatController, postHookWhatsapp, getHookFacebook, postHookFacebook, LeftMessagesController, contactmessagesController, messagesController }