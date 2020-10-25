const { MediaInstance } = require('twilio/lib/rest/api/v2010/account/message/media');
const BDWhatsapp = require('../models/BDWhatsapp');
const BDUltimoMensaje = require('../models/BDLastMsg');
const BDNumbersByUser = require('../models/BDNumbersByUser');
const conn = require('../database');
const BDLastMsg = require('../models/BDLastMsg');

//Crear en la tabla cuentas por usuario el IdUsuario de la aplicación y relacionarlo con un teléfono para whatsapp
function setWSUserAccountNumber(UserId, Number) {
    //Crear el mensaje
    let mensaje = new BDNumbersByUser();
    mensaje.UserId = UserId;
    mensaje.Number = Number;
    console.log("WSUserAccountNumber a grabar: ", mensaje.toJSON())
    mensaje.save(function (err) {
        if (err)
            console.log("WSUserAccountNumber error en save: ", err);
        else
            console.log("WSUserAccountNumber: Guardado correctamente")
    });
}


//Se busca en la tabla de cuentas por usuario qué cuentas le pertenecen. Solo trae un registro.
function getWSUserAccounts(UserId) {
    let consulta = BDNumbersByUser.findOne({ UserId: UserId }, function (err, docs) {
        if (err) return console.log(err)
        console.log("getWSUserAccounts error: ", docs.length)
    });

    consulta.then(docs => {
        console.log(JSON.stringify(docs))
    })
}

//Se filtra por los telefonos encontrados de esa persona. Se muestra  el último mensaje por cada persona
function getWSContactMSG_ByUser(From) {
    let consulta = BDUltimoMensaje.find({ From: From }, function (err, docs) {
        if (err) return console.log(err)
        console.log(docs.length)
    });

    consulta.then(docs => {
        console.log(JSON.stringify(docs))
    })
}

//Se consulta la BD con esos dos parámetros, se ordena por fecha desc
function getWSMessageByFromTo(From, To) {
    let consulta = BDWhatsapp.find({ From: From, To: To }, function (err, docs) {
        if (err) return console.log(err)
        console.log(docs.length)
    }).sort({ Hour: -1 });

    consulta.then(docs => {
        console.log(JSON.stringify(docs))
    })
}

//Guardar en la BD el mensaje
function setWSMessageByFromTo(MessageSid, Body, From, To, Owner) {
    //Crear el mensaje
    let mensaje = new BDWhatsapp();
    mensaje.MessageSid = MessageSid;
    mensaje.Body = Body;
    mensaje.From = From;
    mensaje.To = To;
    mensaje.Owner = Owner;
    console.log(mensaje.toJSON())
    mensaje.save(function (err) {
        if (err)
            console.log("Error en save: ", err);
        else
            console.log("Guardado correctamente")
    });

    ////Crear o actualizar el último mensaje
    //Buscar si ya existe
    let existe = false;
    let consulta = BDLastMsg.findOne({ From: From, To: To }, function (err, res) {
        if (err) {
            console.log("lstMsg error: ", err);
            //return false;
        }
        else {
            console.log("lstMsg res: ", res)
            //console.log("lstMsg res length: ", res.length)

            if (res) {
                let now = new Date();
                console.log("lstMsg data a actualizar: Fecha " + now + ", id " + res._id + ", MessageSIDWS " + MessageSid)

                let ultMsgUpd = BDLastMsg.updateOne({ _id: res._id }, { MessageSid: MessageSid, Hour: now, Body: Body }, function (errupd, resupd) {
                    console.log("ultMsUpd encontrado: ", ultMsgUpd);
                    if (errupd)
                        console.log("error en lstMsg actualizar: ", errupd);
                    else
                        console.log("actualiza registro lstMsg: ", resupd);
                });                
            }
            else {
                let msgupd = new BDLastMsg();
                msgupd.MessageSid= MessageSid;
                msgupd.From=From;
                msgupd.To=To;
                msgupd.Body=Body;
                msgupd.Owner=Owner;                
                //console.log(msgupd.toJSON())
                msgupd.save(function (err) {
                    if (err)
                        console.log("Error en lstMsg save: ", err);
                    else
                        console.log("Guardado lstMsg correctamente")
                });                
            }
        }
    });
}

//setWSMessageByFromTo('0013', 'Cuerpo del mensaje13', '300123', '301234', 1);
//setWSMessageByFromTo('0013', 'Cuerpo del mensaje13', '300123', '301234', 2);
setWSMessageByFromTo('0017', 'Cuerpo del mensaje17', '300123', '301347', 2);
//setWSMessageByFromTo('0007', 'Cuerpo del mensaje7', '300222', '301666');
//setWSMessageByFromTo('0008', 'Cuerpo del mensaje7', '300222', '301444');
//getWSMessageByFromTo('300123', '301234');
//getWSContactMSG_ByUser('300123');
//getWSUserAccounts('2');
//setWSUserAccountNumber('1', '300123');