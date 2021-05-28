let mongoose  = require('mongoose')
let md5 = require('md5')
const jwt = require('jsonwebtoken')
const schema = mongoose.Schema


const tablaRegister = new schema({
    _id : String,
    name : String,
   lastName : String,
    dateOfBirth : String,
    password : String,
    email : String,
    rol : Number
    
})

tablaRegister.statics.savedata = async function savedata (datos){
    const self =this;
    if(datos){
        // hace un hash a la contraseña
        datos.password = md5(datos.password)
        let misDatos = new self(datos)

        await misDatos.save().catch(error => {
            const err = new Error('Error al crear el usuario')
            err.body = {
                msg: "Error al crear el usuario en base de datos",
                code: 304,
                info: error.message
            }
            err.statusCode = 500
            throw err;
        })
        
    }else {
        const err = new Error('No se pudo registrar ')
        err.body = {
            msm : 'Erros en el usuario',
            code: 400
        }
        err.statusCode = 400
        throw err;
    }
}
tablaRegister.statics.login = async function login(datos){
    if(datos){
        datos.password = md5(datos.password)
        let query ={ // Se arma el query para realizar la busqueda
            $and :[ { "email": datos.email},{ "password": datos.password}]
        }

        const result =  await this.find(query)
        if(result[0]){
            console.log(result)
            const token = jwt.sign({
                email : result[0].email,
                name : result[0].name
            },
                "User",{
                    expiresIn : "10min"
                }
            )
            return [token,result[0].name]
        }else{
            const err = new Error('No esta registrado ')
        err.body = {
            msm : 'Registrese por favor',
            code: 400
        }
        err.statusCode = 400
        throw err;
        }
    
        
    }
}
module.exports = mongoose.model('registers',tablaRegister)


    
