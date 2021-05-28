const modelUsers = require('../Models/modelUsers.js')

exports.register = async(req, res) =>{
    try {
        await modelUsers.savedata(req.body)
        return res.send({
            "Mensaje" : "El usuario se ha registrado de forma correcta",
            "status" : "OK"
        })
    } catch (error) {
        res.status(error.statusCode || 500).send(error.body || error.toString());
    }
}

exports.login = async (req, res) => {
    try {  
        const [token,name] = await modelUsers.login(req.body)
        console.log(token)
        console.log(name)
        return res.send({
            "Mensaje" : "ha iniciado sesion",
            'token' : token,
            'name' : name
        }) 
    } catch (error) {
        res.status(error.statusCode || 500).send(error.body || error.toString());
    }

} 