const { MediaInstance } = require('twilio/lib/rest/api/v2010/account/message/media');
const BDWhatsapp = require('../models/BDWhatsapp');
const BDUltimoMensaje = require('../models/BDLastMsg');
const conn = require('../database');
const BDLastMsg = require('../models/BDLastMsg');

//Se busca en la tabla de cuentas por usuario qué cuentas le pertenecen
function getWSUserAccounts(UserId) {


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
    });

    consulta.then(docs => {
        console.log(JSON.stringify(docs))
    })
}

//Guardar en la BD el mensaje
function setWSMessageByFromTo(MessageSid, Body, From, To) 
{
    //Crear el mensaje
    let mensaje = new BDWhatsapp();
    mensaje.MessageSid = MessageSid;
    mensaje.Body = Body;
    mensaje.From = From;
    mensaje.To = To;
    mensaje.Owner = 1;
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
        if (err)
        {
            console.log("lstMsg error: ", err);
            //return false;
        } 
        else
        {
            console.log("lstMsg res: ", res)
            //return true;
            let now = new Date();
            console.log("lstMsg data a actualizar: Fecha " + now + ", id " + res._id + ", MessageSIDWS " + MessageSid)

            let ultMsgUpd = BDLastMsg.updateOne({ _id: res._id}, { MessageSid: MessageSid, Hour: now },function(errupd,resupd){
                console.log("ultMsUpd encontrado: ", ultMsgUpd);
                if(errupd) 
                    console.log("error en lstMsg actualizar: ", errupd);
                else
                    console.log("actualiza registro lstMsg: ", resupd);
                    
            });

        }        
    });
    //.then(docs => {
    //     if (docs != null) existe = true;

    //     //Crear o actualizar el registro
    //     if (existe) //Actualiza
    //     {
    //         //let c = BDUltimoMensaje.update({ From: From, To: To }, { MessageSid: MessageSid, Hour: Date.now() })
    //         //console.log("actualiza registro lstMsg ", c);
    //         let now = new Date();
    //         console.log("lstMsg data a actualizar: Fecha " + now + ", id " + docs._id + ", MessageSIDWS " + MessageSid)

    //         let ultMsgUpd = BDLastMsg.updateOne({ _id: docs._id}, { MessageSid: MessageSid, Hour: now },function(errupd,resupd){
    //             console.log("ultMsUpd encontrado: ", ultMsgUpd);
    //             if(errupd) 
    //                 console.log("error en lstMsg actualizar: ", errupd);
    //             else
    //                 console.log("actualiza registro lstMsg: ", resupd);
                    
    //         });
    //     }
    //     else //Crea
    //     {
    //         let ultimoMensaje = new BDUltimoMensaje();
    //         ultimoMensaje.MessageSid = MessageSid;
    //         ultimoMensaje.From = From;
    //         ultimoMensaje.To = To;
    //         console.log("Crea registro lstMsg ", ultimoMensaje.toJSON())
    //         ultimoMensaje.save(function (err,res) {
    //             if(err)
    //             console.log(err);
    //             else
    //             return true;

    //         });
    //     }
    // })
}

setWSMessageByFromTo('0012', 'Cuerpo del mensaje12', '300123', '301234');
//setWSMessageByFromTo('0007', 'Cuerpo del mensaje7', '300222', '301666');
//setWSMessageByFromTo('0008', 'Cuerpo del mensaje7', '300222', '301444');
//getWSMessageByFromTo('300123', '301789');
//getWSContactMSG_ByUser('300123');