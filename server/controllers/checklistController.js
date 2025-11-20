// controllers/checklistController.js
const Checklist = require('../models/Checklist');
const Trip = require('../models/Trip');
const User = require('../models/User');
const Bird = require('../models/Bird'); // Import Bird model

module.exports = {
    // Create a new checklist
    createChecklist: async (req, res) => {
        try {
            console.log("=== CREATE CHECKLIST DEBUG ===");
            console.log("Request body:", req.body);
            
            const {
                userId,
                tripId,
                title,
                tripPlace,
                date,
                startTime,
                endTime
                // Weather removed
            } = req.body;

            // Validate required fields
            if (!userId || !tripId || !title || !tripPlace || !date) {
                return res.status(400).json({ 
                    message: "Missing required fields",
                    required: ["userId", "tripId", "title", "tripPlace", "date"]
                });
            }

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check if trip exists
            const trip = await Trip.findById(tripId);
            if (!trip) {
                return res.status(404).json({ message: "Trip not found" });
            }

            // Create checklist
            const checklistData = {
                user: userId,
                trip: tripId,
                title,
                tripPlace,
                date: new Date(date),
                observations: [],
                notes: [], // Initialize empty notes array
                startTime: startTime || null,
                endTime: endTime || null
                // Weather removed
            };

            const checklist = new Checklist(checklistData);
            const savedChecklist = await checklist.save();

            // Add checklist to trip
            trip.checklists.push(savedChecklist._id);
            await trip.save();

            console.log("Checklist created successfully:", savedChecklist._id);

            res.status(201).json({
                message: "Checklist created successfully",
                checklist: savedChecklist
            });

        } catch (error) {
            console.error("=== CREATE CHECKLIST ERROR ===");
            console.error("Error:", error);
            
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: "Validation error",
                    details: Object.keys(error.errors).map(key => ({
                        field: key,
                        message: error.errors[key].message
                    }))
                });
            }

            res.status(500).json({
                message: "Server error",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Get all checklists for a user
    getAllChecklists: async (req, res) => {
        try {
            const { userId } = req.params;
            console.log("Getting all checklists for user:", userId);

            const checklists = await Checklist.find({ user: userId })
                .populate('trip', 'title location')
                .sort({ date: -1 });

            res.status(200).json({ checklists });

        } catch (error) {
            console.error("Error fetching checklists:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Get checklists for a specific trip
    getChecklistsByTrip: async (req, res) => {
        try {
            const { tripId } = req.params;
            console.log("Getting checklists for trip:", tripId);

            const checklists = await Checklist.find({ trip: tripId })
                .sort({ date: -1 });

            res.status(200).json({ checklists });

        } catch (error) {
            console.error("Error fetching checklists:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Get a single checklist by ID
    getChecklistById: async (req, res) => {
        try {
            const { checklistId } = req.params;
            console.log("Getting checklist:", checklistId);

            const checklist = await Checklist.findById(checklistId)
                .populate('user', 'username email')
                .populate('trip', 'title location formattedAddress')
                .populate('observations.birdId', 'primaryName scientificName image'); // Populate bird details

            if (!checklist) {
                return res.status(404).json({ message: "Checklist not found" });
            }

            res.status(200).json({ checklist });

        } catch (error) {
            console.error("Error fetching checklist:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Add bird observation to checklist
    addObservation: async (req, res) => {
        try {
            const { checklistId } = req.params;
            const { birdId, count, timeSeen, fieldNotes } = req.body;

            console.log("Adding observation to checklist:", checklistId);

            if (!birdId || !count || !timeSeen) {
                return res.status(400).json({
                    message: "Missing required fields",
                    required: ["birdId", "count", "timeSeen"]
                });
            }

            // Verify bird exists and get details
            const bird = await Bird.findById(birdId);
            if (!bird) {
                return res.status(404).json({ message: "Bird not found" });
            }

            const checklist = await Checklist.findById(checklistId);
            if (!checklist) {
                return res.status(404).json({ message: "Checklist not found" });
            }

            const observation = {
                birdId: bird._id,
                birdName: bird.primaryName,
                scientificName: bird.scientificName,
                count: parseInt(count),
                timeSeen,
                fieldNotes: fieldNotes || ''
            };

            checklist.observations.push(observation);
            await checklist.save();

            res.status(200).json({
                message: "Observation added successfully",
                checklist
            });

        } catch (error) {
            console.error("Error adding observation:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Update bird observation
    updateObservation: async (req, res) => {
        try {
            const { checklistId, observationId } = req.params;
            const { birdId, count, timeSeen, fieldNotes } = req.body;

            console.log("Updating observation:", observationId, "in checklist:", checklistId);

            const checklist = await Checklist.findById(checklistId);
            if (!checklist) {
                return res.status(404).json({ message: "Checklist not found" });
            }

            const observation = checklist.observations.id(observationId);
            if (!observation) {
                return res.status(404).json({ message: "Observation not found" });
            }

            // If birdId is provided, verify and update bird details
            if (birdId) {
                const bird = await Bird.findById(birdId);
                if (!bird) {
                    return res.status(404).json({ message: "Bird not found" });
                }
                observation.birdId = bird._id;
                observation.birdName = bird.primaryName;
                observation.scientificName = bird.scientificName;
            }

            // Update other fields
            if (count !== undefined) observation.count = parseInt(count);
            if (timeSeen) observation.timeSeen = timeSeen;
            if (fieldNotes !== undefined) observation.fieldNotes = fieldNotes;

            await checklist.save();

            res.status(200).json({
                message: "Observation updated successfully",
                checklist
            });

        } catch (error) {
            console.error("Error updating observation:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Delete bird observation
    deleteObservation: async (req, res) => {
        try {
            const { checklistId, observationId } = req.params;

            console.log("Deleting observation:", observationId, "from checklist:", checklistId);

            const checklist = await Checklist.findById(checklistId);
            if (!checklist) {
                return res.status(404).json({ message: "Checklist not found" });
            }

            checklist.observations.pull(observationId);
            await checklist.save();

            res.status(200).json({
                message: "Observation deleted successfully",
                checklist
            });

        } catch (error) {
            console.error("Error deleting observation:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Add note to checklist
    addNote: async (req, res) => {
        try {
            const { checklistId } = req.params;
            const { content } = req.body;

            console.log("Adding note to checklist:", checklistId);

            if (!content) {
                return res.status(400).json({
                    message: "Note content is required"
                });
            }

            const checklist = await Checklist.findById(checklistId);
            if (!checklist) {
                return res.status(404).json({ message: "Checklist not found" });
            }

            const note = {
                content: content.trim()
            };

            checklist.notes.push(note);
            await checklist.save();

            res.status(200).json({
                message: "Note added successfully",
                checklist
            });

        } catch (error) {
            console.error("Error adding note:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Update note in checklist
    updateNote: async (req, res) => {
        try {
            const { checklistId, noteId } = req.params;
            const { content } = req.body;

            console.log("Updating note:", noteId, "in checklist:", checklistId);

            if (!content) {
                return res.status(400).json({
                    message: "Note content is required"
                });
            }

            const checklist = await Checklist.findById(checklistId);
            if (!checklist) {
                return res.status(404).json({ message: "Checklist not found" });
            }

            const note = checklist.notes.id(noteId);
            if (!note) {
                return res.status(404).json({ message: "Note not found" });
            }

            note.content = content.trim();
            await checklist.save();

            res.status(200).json({
                message: "Note updated successfully",
                checklist
            });

        } catch (error) {
            console.error("Error updating note:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Delete note from checklist
    deleteNote: async (req, res) => {
        try {
            const { checklistId, noteId } = req.params;

            console.log("Deleting note:", noteId, "from checklist:", checklistId);

            const checklist = await Checklist.findById(checklistId);
            if (!checklist) {
                return res.status(404).json({ message: "Checklist not found" });
            }

            checklist.notes.pull(noteId);
            await checklist.save();

            res.status(200).json({
                message: "Note deleted successfully",
                checklist
            });

        } catch (error) {
            console.error("Error deleting note:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Update checklist details
    updateChecklist: async (req, res) => {
        try {
            const { checklistId } = req.params;
            const {
                title,
                tripPlace,
                date,
                startTime,
                endTime
                // Weather removed
            } = req.body;

            console.log("Updating checklist:", checklistId);

            const checklist = await Checklist.findById(checklistId);
            if (!checklist) {
                return res.status(404).json({ message: "Checklist not found" });
            }

            // Update fields
            if (title) checklist.title = title;
            if (tripPlace) checklist.tripPlace = tripPlace;
            if (date) checklist.date = new Date(date);
            if (startTime !== undefined) checklist.startTime = startTime;
            if (endTime !== undefined) checklist.endTime = endTime;
            // Weather removed

            await checklist.save();

            res.status(200).json({
                message: "Checklist updated successfully",
                checklist
            });

        } catch (error) {
            console.error("Error updating checklist:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Delete checklist
    deleteChecklist: async (req, res) => {
        try {
            const { checklistId } = req.params;
            console.log("Deleting checklist:", checklistId);

            const checklist = await Checklist.findById(checklistId);
            if (!checklist) {
                return res.status(404).json({ message: "Checklist not found" });
            }

            // Remove checklist reference from trip
            await Trip.findByIdAndUpdate(
                checklist.trip,
                { $pull: { checklists: checklistId } }
            );

            await Checklist.findByIdAndDelete(checklistId);

            res.status(200).json({ message: "Checklist deleted successfully" });

        } catch (error) {
            console.error("Error deleting checklist:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
};