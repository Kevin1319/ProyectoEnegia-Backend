
/*
*@api
*/
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
let mongoose  = require('mongoose')
let md5 = require('md5')
const userRouter = require('./routers/routerUsers')
const usermiddleware = require('./middleware.js')
const jwt = require('jsonwebtoken')
let connectionstrings = "mongodb+srv://Esp32:esp32@servidor.veq4u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))
app.use(morgan('tiny')) // nos dice cuando se hace una peticion

//-----------------------------------------------------------------------------------
//Crea tabla para el servidor mongodb

let tablaDevice = new mongoose.Schema({
    nameDevice : String,
    location : String,
    typeDevice : String
})
let tablaSensores = new mongoose.Schema({
    idDevice : Number,
    corriente : Number,
    voltaje : Number,
    bateria : Number,
    fecha : String,
    desconexion : Number
})
 
//Declaracion de tablas 
let device = mongoose.model("device",tablaDevice)
let sensores = mongoose.model("sensores",tablaSensores)
//------------------------------------------------------------------------------

app.use('/api/users',userRouter)




//********************************************************************************************************************************
// Metodos POST Y GET

app.get('/infosensores',(req,res,next) =>{
    let query = {}
    sensores.find(query,(err, result)=>{
        if(err){
            console.log("Error consultando ...")
            res.send({
                "mensaje" : "Error en la consulta"
            })
        }
        else{
            console.log("Consulta realizada")
            res.send(result)
        }
    })
    let payload = {
        "Mensaje" : "Temperatura",
        "temp" : 18.2
    }
    //res.send(payload)
})

app.get('/infordevices',(req,res,next) =>{
    let query = {}
    device.find(query,(err, result)=>{
        if(err){
            console.log("Error consultando ...")
            res.send({
                "mensaje" : "Error en la consulta"
            })
        }
        else{
            console.log("Consulta realizada")
            res.send(result)
        }
    })
    let payload = {
        "Mensaje" : "Temperatura",
        "temp" : 18.2
    }
    //res.send(payload)
})


app.post('/sensores',usermiddleware.isLoggedIn,(req,res,next) =>{
    console.log("Alguien consulta ...")
    let datos = req.body
    if(datos){
        let misDatos = sensores(datos)
        misDatos.save().then(item =>{
            console.log("El registro de los sensores fue guardado en la base de datos")
        })
        res.send({"mensaje": "Registro realizado en la base de datos"})
    }else {
        let payload = {
            "Mensaje" : "No se encontro datos"
        }
        res.send(payload)
    }
    
})
//app.post('/registerDevice',usermiddleware.validateDevice,usermiddleware.isLoggedIn,(req,res,next)=>{
app.post('/registerDevice',usermiddleware.isLoggedIn,(req,res,next)=>{
    let datos = req.body
    if(datos){
        //datos.nameDevice = md5(datos.nameDevice)// hace un hash a la contraseña
        let misDatos = device(datos) // guardo lo datos del mismo formato de la tabla
        misDatos.save().then(item =>{
            console.log("El registro fue guardado en la base de datos")
             return res.send({
                "Mensaje" : "OK"
            })
        })
    }else {
        payload = {
            "Mensaje" : "No se registro el dispositivo"
        }
        res.send(payload)
    }
    
})


app.post('/login',(req,res,next)=>{
    let datos = req.body
    if(datos){
        datos.password = md5(datos.password)
        let query ={ // Se arma el query para realizar la busqueda
            $and :[ { "_idDevice": datos.email},{ "password": datos.password}]
        }

        device.find(query,(err, result) => {
            if(err){
                console.log("Error al momento de consultar")
                return res.send({ 
                    Mensaje : "Error al momento de consultar"
                })
            }else{
                console.log("Login correctamente")
                const token = jwt.sign({
                    email : result.email,
                    name : result.name
                },
                    "User",{
                        expiresIn : "10min"
                    }
                )
                return res.send(token)
            }

        })
    }
})

app.post('/loginDevice',(req,res,next)=>{
    let datos = req.body
    if(datos){
        datos.nameDevice = md5(datos.nameDevice)
        let query ={
            $and :[ { "nameDevice": datos.nameDevice},{ "location": datos.location}]
        }
        device.find(query,(err, result) => {
            if(err){
                console.log("Error al momento de consultar")
                return res.send({ 
                    Mensaje : "Error al momento de consultar"
                })
            }else{
                console.log("Login correctamente")
                const token = jwt.sign({
                    nameDevice : result.nameDevice,
                    location : result.location
                },
                    "Esp32",{
                        expiresIn : "1hours"
                    }
                )
                return res.send(token)
            }

        })
    }
})

app.post('/modificar',(req,res,next)=>{
        //console.log(req.body)
    let datos = req.body
    if(datos){
        // hace un hash a la contraseña
        //datos.nameDevice = md5(datos.nameDevice)
        let id = {
            "_id" : datos._id
        }
        device.updateOne( id ,{ $set : datos},(err, result) =>{
            if(err){
                console.log("No modifico la base de datos")
                return res.send({ 
                    Mensaje : "No se ha modificado"
                })
                
            }else {
                console.log("Se modifico la base de datos")
                return res.send({ 
                    Mensaje : "Se ha modificado"
                })
            }
            
        })
    }else{
        payload = {
            "Mensaje" : "No se encontraron datos"
        }
         res.send(payload)
    }

    
        
    
    
})

app.post('/eliminar',(req,res,next)=>{
    //console.log(req.body)
let datos = req.body
    if(datos){
        let id = {
            "_id" : datos._id
        }
        device.deleteOne( id,(err, result) =>{
            if(err){
                console.log("No Borro la base de datos")
                return res.send({ 
                    Mensaje : "No se ha borrado"
                })
            }else {
                console.log("Se borro la base de datos")
                return res.send({ 
                    Mensaje : "Se ha borrado"
                })
            }
            
        })
    }else{
        payload = {
            "Mensaje" : "No se encontraron datos"
        }
         res.send(payload)
    }
})

//***********************************************************************************************************
let connected =false

mongoose.connect(connectionstrings, {useNewUrlParser: true, useUnifiedTopology: true},(err,res) => {
    if(err){
        console.log("Error conectando la base de dato "+ err)
    }
    else{
        console.log("Conectado a la base de datos")
        connected = true
    }

})


app.listen(port,()=> console.log("Servidor escuchando en el puerto : "+ port))