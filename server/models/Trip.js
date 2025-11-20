const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    formattedAddress: { 
        type: String 
    },
    coordinates: {
        latitude: { 
            type: Number 
        },
        longitude: { 
            type: Number 
        }
    },
    placeId: { 
        type: String 
    },
    date: { 
        type: Date 
    },
    photos: [{ 
        type: String 
    }], // Array of photo paths
    notes: { 
        type: String, 
        maxlength: 2000 
    },
    checklists: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Checklist' 
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Trip', TripSchema);