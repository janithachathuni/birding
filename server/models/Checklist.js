const mongoose = require('mongoose');

const ChecklistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    place: { type: String, required: true },
    date: { type: Date, required: true },
    birds: { type: [String], default: [] }, // Array of bird IDs or names
});

module.exports = mongoose.model('Checklist', ChecklistSchema);