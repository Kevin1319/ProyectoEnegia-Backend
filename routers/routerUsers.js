const express = require('express')
const router = express.Router()
const usermiddleware = require('../middleware.js')
const userControllers = require('../Controllers/apiUsers')


router.post('/register',usermiddleware.validateRegistration,userControllers.register)
router.post('/login',userControllers.login)

module.exports = router