require('dotenv').config()
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
  let email = req.body.email
  let password = req.body.password

  User.findOne({ $or: [{ email: email }, { password: password }] }).then(
    (user) => {
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.json({
              error: err,
            })
          }

          console.log(user, `user`)

          if (result) {
            let token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
              expiresIn: '1h',
            })
            req.session.user = user
            req.session.save()
            // console.log(jwt.verify(token, process.env.JWT_SECRET), 'token_@')
            res.cookie('sessionId', token, {
              maxAge: 60 * 60 * 24,
              httpOnly: true, // Set to true for added security
              secure: true,
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

const updateUser = (req, res, next) => {
  const { name, email, phone, image } = req.body

  // Find the user by their name in the database
  User.findOne({ name }, (err, user) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Error finding user', status: 500 })
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found', status: 404 })
    }

    // Update user information
    user.name = name || user.name
    user.email = email || user.email
    user.phone = phone || user.phone

    // Update the image only if a new image is provided in the request
    if (image) {
      user.image = image
    }

    // Save the updated user data to the database
    user.save((err) => {
      if (err) {
        console.log(err)
        return res
          .status(500)
          .json({ error: 'Error updating user', status: 500 })
      }

      res.status(200).json({ message: 'User updated successfully' })
    })
  })
}

const update = (req, res, next) => {
  const { name, email, phone, image } = req.body

  // Find the user by their name in the database
  User.findOne({ name }, (err, user) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Error finding user', status: 500 })
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found', status: 404 })
    }

    // Update user information
    user.name = name || user.name
    user.email = email || user.email
    user.phone = phone || user.phone

    // Update the image only if a new image is provided in the request
    if (image) {
      user.image = image
    }

    // Save the updated user data to the database
    user.save((err) => {
      if (err) {
        console.log(err)
        return res
          .status(500)
          .json({ error: 'Error updating user', status: 500 })
      }

      res.status(200).json({ message: 'User updated successfully' })
    })
  })
}

const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find()

    // Send the users as a JSON response
    res.json(users)
  } catch (error) {
    // Handle errors, e.g., send an error response
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const sessionChecker = (req, res) => {
  // const store = req.cookies.sessionId
  // console.log(store, 'session')
  console.log(req.cookies, 'session login')
  if (req.session.user) {
    res.json({ valid: true, username: req.session.user })
  } else {
    res.json({ valid: false })
  }
  // try {
  //   const decoded = jwt.verify(req.cookies.sessionId, process.env.JWT_SECRET)
  //   // Handle the decoded data as needed
  //   // console.log(decoded, 'decoded')
  // } catch (e) {
  //   console.log(e)
  // Handle errors here
  // }
}

module.exports = { register, login, sessionChecker, update, getAllUsers }
