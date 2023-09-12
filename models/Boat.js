const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const BoatSchema = new Schema({
    name: {
        type: String,
    },
    class: [{
        name: String,
        price: Number,
    }],
    image: {
        type: String,
    },
    capacity: {
        type: Number,
    }

}, { timestamps: true });

module.exports = mongoose.model('Boat', BoatSchema);