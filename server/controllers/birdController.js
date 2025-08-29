const Bird = require('../models/Bird');

// Remove these lines - they're causing the error:
// console.log("API endpoint /api/birds/add called");
// console.log("Request body:", req.body);

exports.addBird = async (req, res) => {
    try {
        console.log("Add Bird request received:", req.body); // Keep this line inside the function
        
        const {
            primaryName,
            otherNames,
            scientificName,
            family,
            description,
            sinhalaName,
            tamilName,
            image,
            habitatMap,
            frequency,
            residency,
            endemic,
            places
        } = req.body;

        if (!primaryName || !scientificName || !family || !description || !image || !frequency || !residency) {
            console.log("Missing required fields for bird");
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const bird = await Bird.create({
            primaryName,
            otherNames: otherNames || [],
            scientificName,
            family,
            description,
            sinhalaName: sinhalaName || '',
            tamilName: tamilName || '',
            image,
            habitatMap: habitatMap || '',
            frequency,
            residency,
            endemic: endemic || false,
            places: places || []
        });

        console.log("Bird added successfully:", bird.primaryName);
        
        res.status(201).json({
            message: "Bird added successfully",
            bird
        });
    } catch (error) {
        console.log("Error adding bird:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ message: "Bird with this primary name or scientific name already exists" });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                message: "Validation Error",
                errors: messages
            });
        }

        res.status(500).json({ message: "Failed to add bird. Please try again." });
    }
};