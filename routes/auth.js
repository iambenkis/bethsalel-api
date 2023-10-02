const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const User = require('../controllers/AuthController')

router.post('/register', User.register)
router.post('/login', User.login)
router.put('/update', upload.single('image'), User.update)
router.get('/users', User.getAllUsers)
// router.get('/login', User.sessionChecker)

module.exports = router
