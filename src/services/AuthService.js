global.fetch = require('node-fetch');
global.navigator = () => null;
global.crypto = require('crypto');

const conf = require('../config');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const jwt  = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const request = require('request');
const poolData = {
    UserPoolId  : conf.awsCognitoPoolId,
    ClientId : conf.awsCognitoClientId
}

const pool_region = conf.awsCognitoRegion;

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.Register = function (body, callback){
    console.log(body);
    var name = body.name;
    var email = body.email;
    var password = body.password;
    var attibuteList = [];

    attibuteList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email}));

    userPool.signUp(name, password, attibuteList, null, function(err, result){
        if(err){
            console.log(err);
            callback(err);
        }       

        console.log(result);
        var coginitoUser = result.user;
        callback(null, coginitoUser);
    })
}


exports.Login = function(body, callback){
    var userName = body.name;
    var password = body.password;
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: userName,
        Password: password
    });

    var userData = {
        Username: userName,
        Pool: userPool
    }

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result){
            var accesstoken = result.getAccessToken().getJwtToken();
            callback(null, accesstoken);
        }, 
        onFailure: (function(err){
            console.log(err);
            callback(err);
        })
    })
}



exports.Validate = function(token, callback){
    const url = 'https://cognito-idp.'+ pool_region  + '.amazonaws.com/'+poolData.UserPoolId+'/.well-known/jwks.json';
    console.log(url);
    request({
        url: url, json:true
    }, (error, response, body) => {

        console.log(response);
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
                callback(new Error('Not a valid JWT token'));
            }

            var kid= decodedJwt.header.kid;
            var pem = pems[kid];
            if(!pem){
                console.log('Invalid token');
                callback(new Error('Invalid token'));
            }

            jwt.verify(token, pem, function(err, payload){
                if(err){
                    console.log("Invalid token");
                    callback(new Error('Invalid token'));
                }else{
                    console.log("Valid token");
                    callback(null, "Valid token");
                }
            })
        }else{
            console.log("Error! Unable to download JWKs");
            callback(error);
        }
    });
}
