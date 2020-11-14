const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const MessageService = require('../services/MessageService');
const request = require('request');
const conf = require('../config');

const poolData = {
    UserPoolId  : conf.awsCognitoPoolId,
    ClientId : conf.awsCognitoClientId
}

const pool_region = conf.awsCognitoRegion;


/*module.exports = (req, res, next)=>{
    // Leer token del header
    const token = req.header('x-auth-token');

    // Revisar si no hay token
    if(!token){
        res.status(401).json({msg:"No hay token, permiso no válido"});
    }

    // validar el token
    try{
        const valid = jwt.verify(token, config.keySecret);
        console.log(valid);
        req.user = valid.user;
        next();
    }catch(error){
        res.status(401).json({msg:"Token no válido"});
    }
};*/


module.exports = (req, res, next)=>{
    // Leer token del header
    //const token = req.header('x-auth-token');
    const token = req.headers['authorization'];

    // Revisar si no hay token
    if(!token){
        res.status(401).json({msg:"No hay token, permiso no válido"});
    }

    const url = 'https://cognito-idp.'+ pool_region  + '.amazonaws.com/'+poolData.UserPoolId+'/.well-known/jwks.json';
    console.log(url);

    request({
        url: url, json:true
    }, function(error, response, body){
        if(!error && response.statusCode == 200){
            pems = {};
            var keys = body['keys'];
            for(var i = 0; i< keys.length; i++){
                var key_id = keys[i].kid;
                var modulus = keys[i].n;
                var exponent = keys[i].e;
                var key_type = keys[i].kty;
                var jwk = {kty: key_type, n: modulus, e: exponent};
                var pem = jwkToPem(jwk);
                pems[key_id]= pem;
            }

            var decodedJwt = jwt.decode(token, {complete:true});

            if(!decodedJwt){
                console.log("Not a valid JWT token");
                res.status(401);
                return res.send('Invalid token');
            }

            var kid= decodedJwt.header.kid;
            var pem = pems[kid];
            if(!pem){
                console.log('Invalid token');
                res.status(401);
                return res.send('Invalid token');
            }

            jwt.verify(token, pem, function(err, payload){
                if(err){
                    console.log("Invalid token");
                    res.status(401);
                    return res.send('Invalid token');
                }else{
                    // Consultar en base de datos el username, si no existe crearlo con al menos la cuenta whatsapp [phone_number] (insert en account)
                    console.log(payload);
                    MessageService.verifyAccount(payload.username, payload.phone_number);
                    req.user = payload.username;
                    console.log("Valid token");
                    return next();
                }
            })
        }else{
            console.log("Error! Unable to download JWKs");
            res.status(500);
            return res.send("Error! Unable to download JWKs");
        }
    });
}