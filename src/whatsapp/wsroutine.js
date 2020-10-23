const { MediaInstance } = require('twilio/lib/rest/api/v2010/account/message/media');
const BDWhatsapp = require('../models/BDWhatsapp');
const BDUltimoMensaje = require('../models/BDLastMsg');
const conn = require('../database');

//Se busca en la tabla de cuentas por usuario qué cuentas le pertenecen
function getWSUserAccounts(UserId) {


}

//Se filtra por los telefonos encontrados de esa persona. Se muestra  el último mensaje por cada persona
function getWSContactMSG_ByUser(From) {
    var consulta = BDUltimoMensaje.find({ From: From }, function (err, docs) {
        if (err) return console.log(err)
        console.log(docs.length)
    });

    consulta.then(docs => {
        console.log(JSON.stringify(docs))
    })

}

//Se consulta la BD con esos dos parámetros, se ordena por fecha desc
function getWSMessageByFromTo(From, To) {
    var consulta = BDWhatsapp.find({ From: From, To: To }, function (err, docs) {
        if (err) return console.log(err)
        console.log(docs.length)
    });

    consulta.then(docs => {
        console.log(JSON.stringify(docs))
    })
}

//Guardar en la BD el mensaje
function setWSMessageByFromTo(MessageSid, Body, From, To) {
    //Crear el mensaje
    var mensaje = new BDWhatsapp();
    mensaje.MessageSid = MessageSid;
    mensaje.Body = Body;
    mensaje.From = From;
    mensaje.To = To;
    mensaje.Owner = 1;
    console.log(mensaje.toJSON())
    mensaje.save(function (err) {
        console.log(err);
    });

    ////Crear o actualizar el último mensaje
    //Buscar si ya existe
    var existe = false;
    var consulta = BDWhatsapp.findOne({ From: From, To: To }, function (err, docs) {
        if (err) return console.log(err)
        //console.log(docs.length)
    });
    consulta.then(docs => {
        if (docs != null) existe = true;

        //Crear o actualizar el registro
        if (existe) //Actualiza
        {
            var c = BDUltimoMensaje.update({ From: From, To: To }, { MessageSid: MessageSid, Hour: Date.now() })
            console.log(c);
        }
        else //Crea
        {
            var ultimoMensaje = new BDUltimoMensaje();
            ultimoMensaje.MessageSid = MessageSid;
            ultimoMensaje.From = From;
            ultimoMensaje.To = To;
            console.log(ultimoMensaje.toJSON())
            ultimoMensaje.save(function (err) {
                console.log(err);
            });
        }
    })
}

//setWSMessageByFromTo('0001', 'Cuerpo del mensaje7', '300123', '301234');
//getWSMessageByFromTo('300123', '301789');
getWSContactMSG_ByUser('300123');