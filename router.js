const express = require('express')
const router = express.Router()


router.get('/saludo',(req, res, next)=>{
    console.log(req)
    res.send("Hola desde api rest")
} )
