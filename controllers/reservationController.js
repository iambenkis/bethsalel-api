// controllers/reservationController.js
const mongoose = require('mongoose')
const Reservation = require('../models/reservation')
const User = require('../models/User')
const Boat = require('../models/Boat')
const nodemailer = require('nodemailer')
const juice = require('juice')

// Create a new reservation
let create = (req, res, next) => {
  const { userId, boatId, departureDate, returnDate, isRoundtrip, boatClass } =
    req.body

  const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'gmail' for Gmail
    auth: {
      user: 'benkisenge03@gmail.com',
      pass: 'pxemigdrtvgzqtjx',
    },
  })

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

      console.log(isRoundtrip, 'isRoundtrip')

      // Save the reservation to the database
      reservation
        .save()
        .then((response) => {
          const mailOptions = {
            from: 'benkisenge03@gmail.com', // Replace with your email
            to: userM.email, // Use the user's email from the User document
            subject: 'Reservation Confirmation',
            html: juice(`
            <style>
            .flex{
              width: 70%;
              display: flex;
              flex-direction: column; 
              padding: 10px; 
            }
            .justify-between {
              justify-content: space-between;
            }
            .bg {
              background-color: #edf2f7;
            }

            .font-medium {
              font-weight: 400;
            }
            .mr {
              margin-right: 50%;
            }
            </style>
             <p>Your reservation has been confirmed for boat <strong>${boatId}</strong></p>
             <div class="flex bg justify-between ">
              <div class="mr">
                <h3 class="font-medium">Full name : 
                  <strong>${userId}</strong>
                </h3>
                <h3 class="font-medium">Ship name: 
                  <strong>${boatId}</strong>
                </h3>
                <h3 class="font-medium">Ship class: 
                  <strong>${boatClass}</strong>
                </h3>
              </div>
              <div>
                ${
                  isRoundtrip === 'roundtrip'
                    ? `<div>
                    <h3 class="font-medium">
                     Trip Status:  <strong>Round trip</strong>
                    </h3>
                    <h3 class="font-medium">
                      Departure date : <strong>${departureDate}</strong>
                    </h3>
                    <h3 class="font-medium">Return date: 
                      <strong>${returnDate}</strong>
                    </h3>
                  </div>`
                    : `<div>
                    <h3 class="font-medium">
                      Trip Status: <strong>One way</strong>
                    </h3>
                    <h3 class="font-medium">
                      <strong>Departure date : ${departureDate}</strong>
                    </h3>
                    <h3 class="font-medium">
                      <strong>Return date: {'-'}</strong>
                    </h3>
                  </div>`
                }
              </div> 
            </div>
            `),
          }

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error)
            } else {
              console.log('Email sent:', info.response)
            }
          })

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
  const { name } = req.body

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
