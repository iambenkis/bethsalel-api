const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = (req, res, next) => {
  const { name, email, phone, password, confirmPassword } = req.body

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ error: 'Passwords do not match', status: 400 })
  }

  // Create a new user with email and password
  const user = new User({ name, email, password, confirmPassword })

  // Save the user to the database
  user.save((err) => {
    if (err) {
      console.log(err)
      return res
        .status(500)
        .json({ error: 'Registration failed, Check your logins', status: 500 })
    }
    res.status(201).json({ message: 'User registered successfully' })
  })
}

const login = (req, res) => {
  let username = req.body.username
  let password = req.body.password

  User.findOne({ $or: [{ email: username }, { phone: username }] }).then(
    (user) => {
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.json({
              error: err,
            })
          }
          if (result) {
            let token = jwt.sign({ name: user.name }, 'verySecretValue', {
              expiresIn: '1h',
            })
            req.session.user = user
            req.session.save()
            res.cookie('bth_auth', req.session.user, {
              maxAge: 60 * 60 * 24,
              httpOnly: true, // Set to true for added security
            })
            console.log(req.session, 'session login')
            res.json({
              message: 'Login Successful!',
              token,
              username: req.session.user,
            })
          } else {
            res.json({
              message: 'Incorrect password!',
            })
          }
        })
      } else {
        res.json({
          message: 'No user found!',
        })
      }
    }
  )
}

const sessionChecker = (req, res) => {
  console.log(req.session.user, 'session')
  if (req.session.user) {
    res.json({ valid: true, username: req.session.user })
  } else {
    res.json({ valid: false })
  }
}

module.exports = { register, login, sessionChecker }
