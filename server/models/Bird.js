const mongoose = require('mongoose')

const BirdSchema = new mongoose.Schema({
    // Primary name is required, other names are optional
    primaryName: { type: String, required: true },
    otherNames: { type: [String], default: [] }, // Array of alternative names
    
    scientificName: { type: String, required: true },
    family: { type: String, required: true },
    description: { type: String, required: true },
    
    // Local names
    sinhalaName: { type: String },
    tamilName: { type: String },
    
    // Images
    image: { type: String, required: true },
    habitatMap: { type: String },
    
    // Status information
    frequency: { 
        type: String, 
        enum: ['Very Common', 'Common', 'Uncommon', 'Rare', 'Very Rare'], 
        required: true 
    },
    residency: { 
        type: String, 
        enum: ['Resident', 'Migrant', 'Vagrant'], 
        required: true 
    },
    endemic: { type: Boolean, default: false },
    
    // Places where the bird is found (array of strings)
    places: { type: [String], default: [] },
    
    // Timestamps for tracking
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

BirdSchema.index({ primaryName: 1 }, { unique: true });
BirdSchema.index({ scientificName: 1 }, { unique: true });

module.exports = mongoose.model('Bird', BirdSchema);