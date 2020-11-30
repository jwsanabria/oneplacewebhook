
module.exports = {
    twilioAccountId: process.env.TWILIO_ACCOUNT_ID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioNumeroEmprendedor: process.env.NUM_EMPRENDEDOR,
    twilioNumeroCliente: process.env.NUM_CLIENTE,
    mongoDbUser: process.env.OP_MONGODB_USER,
    mongoDbPassword: process.env.OP_MONGODB_PASSWORD,
    montoDbDatabase: process.env.OP_MONGODB_DATABASE,
    facebookVerificationToken: process.env.VERIFICATION_TOKEN,
    messageNetworkFacebook: 1,
    messageNetworkWhatsapp: 2,
    messageTypeInbound:1,
    messageTypeOutbound:2,
    keySecret: process.env.KEY_SECRET,
    awsCognitoRegion: process.env.AWS_COGNITO_REGION,
    awsCognitoPoolId: process.env.AWS_COGINTO_POOL_ID,
    awsCognitoClientId: process.env.AWS_COGNITO_CLIENT_ID
    
}