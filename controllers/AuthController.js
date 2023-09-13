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
  const user = new User({ name, email, phone, password, confirmPassword })

  // Save the user to the database
  user.save((err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: 'Registration failed, Check your logins', status: 500 })
    }
    res.status(201).json({ message: 'User registered successfully' })
  })
}

const login = (req, res, next) => {
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
            res.json({
              message: 'Login Successful!',
              token,
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

module.exports = { register, login }
