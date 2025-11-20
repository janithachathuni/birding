// models/Checklist.js
const mongoose = require('mongoose');

const BirdObservationSchema = new mongoose.Schema({
    birdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bird',
        required: true
    },
    birdName: {
        type: String,
        required: true
    },
    scientificName: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true,
        default: 1,
        min: 0
    },
    timeSeen: {
        type: String, // Format: "HH:MM" or full timestamp
        required: true
    },
    fieldNotes: {
        type: String,
        maxlength: 500
    }
}, { _id: true });

const ChecklistNoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const ChecklistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tripPlace: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    observations: [BirdObservationSchema],
    notes: [ChecklistNoteSchema], // Multiple notes instead of single generalNotes
    totalSpecies: {
        type: Number,
        default: 0
    },
    totalIndividuals: {
        type: Number,
        default: 0
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    }
    // Weather field removed as requested
}, {
    timestamps: true
});

// Update totals before saving
ChecklistSchema.pre('save', function(next) {
    this.totalSpecies = this.observations.length;
    this.totalIndividuals = this.observations.reduce((sum, obs) => sum + obs.count, 0);
    next();
});

module.exports = mongoose.model('Checklist', ChecklistSchema);