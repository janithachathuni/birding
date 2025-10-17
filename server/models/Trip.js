const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    place: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
})

module.exports = mongoose.model('Trip', TripSchema);