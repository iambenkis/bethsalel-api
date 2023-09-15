// controllers/reservationController.js
const Reservation = require('../models/reservation')

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { userId, boatId, reservationDate } = req.body

    // Create a reservation instance
    const reservation = new Reservation({
      user: userId,
      boat: boatId,
      reservationDate,
    })

    // Save the reservation to the database
    await reservation.save()

    res
      .status(201)
      .json({ message: 'Reservation created successfully', reservation })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create reservation' })
  }
}

// Get a list of reservations
exports.listReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user boat')

    res.status(200).json(reservations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to retrieve reservations' })
  }
}

// Other reservation-related controller actions can be added here (e.g., update, delete)
