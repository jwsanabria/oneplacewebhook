const jwt = require('jsonwebtoken');


module.exports = (req, res, next)=>{
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
};