const Bird = require('../models/Bird');

exports.addBird = async (req, res) => {
    try {
        console.log("Add Bird request received:", req.body); // Keep this line inside the function
        
        const {
            primaryName,
            otherNames,
            scientificName,
            order,
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

        if (!primaryName || !scientificName || !order || !family || !description || !image || !frequency || !residency) {
            console.log("Missing required fields for bird");
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const bird = await Bird.create({
            primaryName,
            otherNames: otherNames || [],
            scientificName,
            order,
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

//get all birds controller
exports.getAllBirds = async(req,res)=>{
    try{
        const birds = await Bird.find(); //fetching all docs in bird collection
        res.status(200).json(birds) //sends the array of birds as a jason respons
    }catch(error){
        res.status(500).json({message:"Error fetching birds"})
    }
}

// //delete bird controller 
exports.deleteBird = async(req, res) =>{
    try{
        const {id} = req.params;
        const deletedBird = await Bird.findByIdAndDelete(id);
        if(!deletedBird){
            return res.status(404).json({message:"Bird not found"})
        }
        res.status(200).json({message:"Bird deleted successfully"}) 
    }catch(error){
        res.status(500).json({message:"Error deleting bird"})
    }
}