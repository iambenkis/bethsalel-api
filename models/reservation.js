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
    type: String,
    required: true,
  },
  returnDate: {
    type: String,
    required: true,
  },
  isRoundtrip: {
    type: String,
    required: true,
  },
  boatClass: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
})

module.exports = mongoose.model('Reservation', reservationSchema)
