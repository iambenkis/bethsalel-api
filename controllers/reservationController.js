// controllers/reservationController.js
const mongoose = require('mongoose')
const Reservation = require('../models/reservation')
const User = require('../models/User')
const Boat = require('../models/Boat')

// Create a new reservation
let create = (req, res, next) => {
  const { userId, boatId, departureDate, returnDate, isRoundtrip, boatClass } =
    req.body

  const ObjectId = mongoose.Types.ObjectId
  // const user = new ObjectId(userId)
  // const boat = new ObjectId(boatId)
  // console.log(userId, 'user')
  // const user = User.findOne({ name: userId })
  // const boat = Boat.findOne({ name: boatId })
  let userM

  User.findOne({ name: userId })
    .then((user) => {
      if (!user) {
        throw new Error('User not found')
      }
      userM = user
      // Find the Boat document by boat name
      return Boat.findOne({ name: boatId })
    })
    .then((boat) => {
      if (!boat) {
        throw new Error('Boat not found')
      }

      // console.log(boatId._id, 'boat')
      // Create a reservation instance
      const reservation = new Reservation({
        user: userM._id,
        boat: boat._id,
        departureDate: departureDate,
        returnDate: returnDate,
        isRoundtrip: isRoundtrip,
        boatClass: boatClass,
      })

      // Save the reservation to the database
      reservation
        .save()
        .then((response) => {
          res.json({
            message: 'Reservation Added Successfully!',
          })
        })
        .catch((error) => {
          res.json({
            message: error,
          })
        })
    })
    .then((reservation) => {
      console.log('Reservation saved:', reservation)
    })
    .catch((error) => {
      console.error('Error saving reservation:', error)
    })
}

// Get a list of reservations
// Admins can view all reservations, while users can only view their own reservations
const index = (req, res, next) => {
  Reservation.find()
    .populate('user') // Populate the 'user' field with the associated User document
    .populate('boat')
    .then((response) => {
      res.json({
        response,
      })
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ error: 'Failed to retrieve reservations' })
    })
}

// Get a single reservation for a user
const show = (req, res, next) => {
  const { name } = req.params

  User.findOne({ name })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Find reservations that belong to the user
      Reservation.find({ user: user._id })
        .populate('user') // Populate the 'user' field with the associated User document
        .populate('boat')
        .then((reservations) => {
          res.json({ reservations })
        })
        .catch((error) => {
          console.error(error)
          res.status(500).json({ error: 'Failed to retrieve reservations' })
        })
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ error: 'Failed to find user' })
    })
}

// Other reservation-related controller actions can be added here (e.g., update, delete)

module.exports = { create, index, show }
