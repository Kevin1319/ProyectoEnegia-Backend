const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const router = express.Router()
const http = require('http').createServer(app)
app.set('port', process.env.PORT || 3000); //verifica si el puerto esta ocupado y le repsonde con u puerto que este libre

// Declaracion de middelware

app.use(morgan('tiny')) // nos dice cuando se hace una peticion
app.use(cors()) // es para problemas
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // para formato www......
app.use('/api', router)
const mongoose =require('mongoose')
var conexion = "mongodb+srv://dbkevin:<dbcolombia>@cluster0.khm4m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
var nameDataBase = new mongoose.Schema({
    correo : String,
    apellido : String,
    cedula : Number,
    clave : String,
    ciudad : Number, 
    cargo : Number
})

var usuario = new mongoose.model("Usuarios", nameDataBase)



router.post('/energia_info',(req,res,next)=>{
    var info = req.body
    console.log(info)
    //console.log(req)
    return res.send("OK")
    

})

var connecteddb =false
mongoose.connect(conexion,{useNewUrlParser: true, useUnifedTopology: true}, (err, res)=>{
    if(err){
        console.log("ERROR al conectarse a la base de datos")
    }else{
        console.log("conectado correctamente")
        connecteddb =true
    }
})

http.listen(app.get("port"), () => console.log('Servidor escuchando en puerto: '+ app.get("port")))