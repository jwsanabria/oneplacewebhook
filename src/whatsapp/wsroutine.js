const { MediaInstance } = require('twilio/lib/rest/api/v2010/account/message/media');
const bdAccess = require('../models/BDWhatsapp');
const conn = require('../database')

//Se busca en la tabla de cuentas por usuario qué cuentas le pertenecen
function getWSUserAccounts(UserId)
{


}

//Se filtra por los telefonos encontrados de esa persona. Se muestra  el último mensaje por cada persona
function getWSContactMSG_ByUser(WSUserAccountId)
{


}

//Se consulta la BD con esos dos parámetros, se ordena por fecha desc
function getWSMessageByFromTo(From1, To1)
{
    var query=bdAccess.WhastappMsg.find({ From: From1, To: To1});
    console.log(query);

}

//Guardar en la BD el mensaje
function setWSMessageByFromTo(MessageSid, Body, From, To)
{
    var mensaje = new bdAccess();
    mensaje.MessageSid=MessageSid;
    mensaje.Body=Body;
    mensaje.From=From;
    mensaje.To=To;
    mensaje.Owner=1; 
    console.log(mensaje.toJSON())
    mensaje.save(function (err) {
        console.log(err);
    });
}

setWSMessageByFromTo('0001', 'Cuerpo del mensaje', 'Desde 300', 'Hacia 301');