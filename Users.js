const jwt = require('jsonwebtoken')
module.exports = {
    isLoggedIn : (req, res, next)=>{
        try {
            const token = req.headers.authorization
            const decode = jwt.verify(
                token,
                "User"
            )

            next()  
        }catch(err){
            console.log("Token no existe")
            return res.status(400).send({ 
                msm : "Token no valido"
            })
        }
    },
    isLoggedDevice : (req, res, next)=>{
        try {
            const token = req.headers.authorization
            const decode = jwt.verify(
                token,
                "Esp32"
            )

            next()  
        }catch(err){
            console.log("Token no existe")
            return res.status(400).send({ 
                msm : "Token no valido"
            })
        }
    },

    validateRegistration : (req, res, next)=>{
        if(!req.body.email || req.body.email.length < 4){
            return res.status(400).send({message :"ingrese un correo valido"})
        }
        if(!req.body.password || req.body.password.length < 4){
            return res.status(400).send({message :"Ingrese la contraseña"})
        }
        if(req.body.password != req.body.password2){
            return res.status(400).send({message :"las contraseñas no son iguales"})
        }
        if(req.body.email != req.body.email2){
            return res.status(400).send({message :"los correos no son iguales"})
        }
        if( req.body.name.length < 2){
            return res.status(400).send({message :"un nombre valido"})
        }
        if( req.body.lastName.length < 2){
            return res.status(400).send({message :"un Apellido valido"})
        }
        if( req.body.rol > 3){
            return res.status(400).send({message :"Se ha excedido de las opciones"})
        }
        next()


    },
    validateDevice : (req, res, next)=>{
        if( req.body.location >3){
            return res.status(400).send({message :"Ciudad fuera de alcance"})
        }
        if( req.body.typeDevice >3){
            return res.status(400).send({message :"No se ha encontrado el tipo de dispositivo"})
        }
        if( req.body.nameDevice.length < 2){
            return res.status(400).send({message :"un nombre valido"})
        }
        next()

    }



}