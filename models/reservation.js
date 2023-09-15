const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reservationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  boat: {
    type: Schema.Types.ObjectId,
    ref: 'Boat',
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  isRoundTrip: {
    type: Boolean,
    required: true,
  },
})

module.exports = mongoose.model('Reservation', reservationSchema)
