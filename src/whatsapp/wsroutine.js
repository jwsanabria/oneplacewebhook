const { MediaInstance } = require('twilio/lib/rest/api/v2010/account/message/media');
const BDWhatsapp = require('../models/BDWhatsapp');
const BDUltimoMensaje = require('../models/BDLastMsg');
const BDNumbersByUser = require('../models/BDNumbersByUser');
const conn = require('../database');
const BDLastMsg = require('../models/BDLastMsg');
const { ExportCustomJobPage } = require('twilio/lib/rest/bulkexports/v1/export/exportCustomJob');

//ok
//Crear en la tabla cuentas por usuario el IdUsuario de la aplicación y relacionarlo con un teléfono para whatsapp.
//No valida si ya se encuentra previamente.
//Retorna true o false.
function setWSUserAccountNumber(UserId, Number) {
    return new Promise((resolve, reject) => {
        //Crear el mensaje
        let mensaje = new BDNumbersByUser();
        mensaje.UserId = UserId;
        mensaje.Number = Number;
        console.log("WSUserAccountNumber a grabar: ", mensaje.toJSON())
        mensaje.save(function (err) {
            if (err) {
                console.log("WSUserAccountNumber error en save: ", err);
                reject(err);
                resolve(false);
            }
            else {
                console.log("WSUserAccountNumber: Guardado correctamente");
                resolve(true);
            }
        });
    });
}

//ok
//Busca en la tabla de cuentas por usuario qué cuentas (número de whatsapp) le pertenecen. Solo trae un registro.
//Retorna json.
async function getWSUserAccounts(UserId) {
    return new Promise((resolve, reject) => {
        BDNumbersByUser.findOne({ UserId: UserId }, function (err, docs) {
            if (err) {
                console.log("getWSUserAccounts error: ", err);
                reject(JSON.stringify(''));
            }
            else {
                let resp = JSON.stringify(docs);
                console.log("getWSUserAccounts respuesta: ", resp);
                resolve(resp);
            }
        });
    });
}

//ok
//Muestra el último mensaje de cada cliente por Usuario. 
//Retorna json.
function getWSContactMSG_ByUser(From) {
    return new Promise((resolve, reject) => {
        let consulta = BDUltimoMensaje.find({ From: From }, function (err, docs) {
            if (err) {
                console.log("getWSContactMSG_ByUser error: ", err);
                reject(JSON.stringify(''));
            }
        });

        consulta.then(docs => {
            let resp = JSON.stringify(docs);
            console.log("getWSContactMSG_ByUser respuesta: ", resp);
            resolve(resp);
        })
    });
}

//ok
//Se consulta la BD con esos dos parámetros, se ordena por fecha desc.
//Retorna json.
function getWSMessageByFromTo(From, To) {
    return new Promise((resolve, reject) => {
        let consulta = BDWhatsapp.find({ From: From, To: To }, function (err, docs) {
            if (err) {
                console.log("getWSMessageByFromTo error: ", err);
                reject(JSON.stringify(''));
            }
        }).sort({ Hour: -1 });

        consulta.then(docs => {
            let resp = JSON.stringify(docs);
            console.log("getWSMessageByFromTo respuesta: ", resp);
            resolve(resp);
        })
    });
}

//
//Guardar en la BD el mensaje que proviene de la interacción.
//También guarda o actualiza en la tabla de Ultimos mensajes la última interacción que se tuvo con ese cliente.
//Retorna true o false.
function setWSMessageByFromTo(MessageSid, Body, From, To, Owner) {
    return new Promise((resolve, reject) => {
        //Crear el mensaje
        let mensaje = new BDWhatsapp();
        mensaje.MessageSid = MessageSid;
        mensaje.Body = Body;
        mensaje.From = From;
        mensaje.To = To;
        mensaje.Owner = Owner;
        console.log(mensaje.toJSON())
        mensaje.save(function (err) {
            if (err) {
                console.log("setWSMessageByFromTo error en save: ", err);
                reject(err);
                resolve(false);
            }
            else {
                console.log("setWSMessageByFromTo guardado correctamente")
                resolve(true); //TODO: Dejar en cascada para que la actualización en BD también vaya incluída en esta respuesta.
            }
        });

        ////Crear o actualizar el último mensaje
        //Buscar si ya existe
        let consulta = BDLastMsg.findOne({ From: From, To: To }, function (err, res) {
            if (err) {
                console.log("lstMsg error: ", err);
                return false;
            }
            else {
                console.log("lstMsg res: ", res)

                if (res) {
                    let now = new Date();
                    console.log("lstMsg data a actualizar: Fecha " + now + ", id " + res._id + ", MessageSIDWS " + MessageSid)

                    let ultMsgUpd = BDLastMsg.updateOne({ _id: res._id }, { MessageSid: MessageSid, Hour: now, Body: Body, Owner: Owner }, function (errupd, resupd) {
                        console.log("ultMsUpd encontrado: ", ultMsgUpd);
                        if (errupd) {
                            console.log("error en lstMsg actualizar: ", errupd);
                            return false;
                        }
                        else {
                            console.log("actualiza registro lstMsg: ", resupd);
                            return true;
                        }
                    });
                }
                else {
                    let msgupd = new BDLastMsg();
                    msgupd.MessageSid = MessageSid;
                    msgupd.From = From;
                    msgupd.To = To;
                    msgupd.Body = Body;
                    msgupd.Owner = Owner;

                    msgupd.save(function (err) {
                        if (err) {
                            console.log("Error en lstMsg save: ", err);
                            return false;
                        }
                        else {
                            console.log("Guardado lstMsg correctamente")
                            return true;
                        }
                    });
                }
            }
        });
    });
}

//console.log(setWSUserAccountNumber('3', '300125'));
//console.log("Respuest fuera: ", getWSUserAccounts('2').then(msg => {console.log(msg)})); //.then(resp => {console.log("Respuesta fuera: ", resp)})

//getWSUserAccounts('2').then(function (msg1, msg2) { console.log(msg1) });


//setWSMessageByFromTo('0018', 'Cuerpo del mensaje18', '300123', '301348', 2);
//getWSMessageByFromTo('300123', '3012345');
//getWSContactMSG_ByUser('300123');

exports.getWSUserAccounts = getWSUserAccounts;
exports.getWSContactMSG_ByUser = getWSContactMSG_ByUser;
exports.getWSMessageByFromTo = getWSMessageByFromTo;
exports.setWSUserAccountNumber = setWSUserAccountNumber;
exports.setWSMessageByFromTo = setWSMessageByFromTo;
