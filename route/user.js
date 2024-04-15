const express = require('express')
const { signup, login, subscription } = require('../controller/admin')
const router = express.Router()

//USER SIGNUP
router.post('/signup', signup)

//USER LOGIN
router.post('/login', login)

router.get('/subscription', subscription)

module.exports = router
