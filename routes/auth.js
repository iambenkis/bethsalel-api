const express = require('express')
const router = express.Router()

const User = require('../controllers/AuthController')

router.post('/register', User.register)
router.post('/login', User.login)
router.get('/session', User.sessionChecker)

module.exports = router
