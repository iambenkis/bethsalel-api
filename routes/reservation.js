const express = require('express')
const router = express.Router()
const reservationController = require('../controllers/reservationController')

// Create a reservation
router.post('/reservations', reservationController.create)

// Get a list of reservations
router.get('/reservations', reservationController.index)

// Get a reservation by id
router.post('/reservation', reservationController.show)

// Add routes for other reservation-related actions (e.g., update, delete) as needed

module.exports = router
