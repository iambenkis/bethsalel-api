const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BoatSchema = new Schema(
  {
    name: {
      type: String,
    },
    class: [
      {
        name: String,
        price: Number,
      },
    ],
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    availability: {},
  },
  { timestamps: true }
)

module.exports = mongoose.model('Boat', BoatSchema)
