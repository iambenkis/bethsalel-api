const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', function (next) {
  const user = this

  // Check if password and confirmPassword match
  if (user.isModified('password') && user.password !== user.confirmPassword) {
    const error = new Error('Passwords do not match')
    return next(error)
  }

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // Generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    // Hash the password along with the new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)

      // Replace the plain text password with the hashed password
      user.password = hash
      user.confirmPassword = '' // Clear the confirmPassword field
      next()
    })
  })
})

module.exports = mongoose.model('User', UserSchema)
