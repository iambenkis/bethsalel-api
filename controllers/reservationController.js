// controllers/reservationController.js
const Reservation = require('../models/reservation')

// Create a new reservation
let create = (req, res, next) => {
  const { userId, boatId, departureDate, returnDate, isRoundtrip, boatClass } =
    req.body

  // Create a reservation instance
  const reservation = new Reservation({
    user: userId,
    boat: boatId,
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
        message: 'An error Occured!',
      })
    })
}

// Get a list of reservations
const index = (req, res, next) => {
  Reservation.find()
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

// Other reservation-related controller actions can be added here (e.g., update, delete)

module.exports = { create, index }
