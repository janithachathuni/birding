const Trip = require("../models/Trip");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

module.exports = {
  // Create a new trip
  createTrip: async (req, res) => {
    try {
      console.log("=== CREATE TRIP DEBUG ===");
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);

      const {
        userId,
        title,
        location,
        formattedAddress,
        latitude,
        longitude,
        placeId,
        date,
        notes,
      } = req.body;

      console.log("Extracted userId:", userId);

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Validate userId format
      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Handle photo uploads
      const photos = req.files ? req.files.map((file) => file.path) : [];
      console.log("Photos paths:", photos);

      // Create trip object
      const tripData = {
        user: userId,
        title: title || "Untitled Trip",
        location: location || "",
        formattedAddress: formattedAddress || "",
        coordinates: {
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
        },
        placeId: placeId || null,
        date: date || new Date(),
        photos: photos,
        notes: notes || "",
        checklists: [],
      };

      console.log("Trip data to save:", tripData);

      // Create new trip
      const trip = new Trip(tripData);
      const savedTrip = await trip.save();
      console.log("Trip saved successfully:", savedTrip._id);

      res.status(201).json({
        message: "Trip created successfully",
        trip: savedTrip,
      });
    } catch (error) {
      console.error("=== CREATE TRIP ERROR ===");
      console.error("Error:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error",
          details: Object.keys(error.errors).map((key) => ({
            field: key,
            message: error.errors[key].message,
          })),
        });
      }

      res.status(500).json({
        message: "Server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get all trips for a user
  getAllTrips: async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("Getting all trips for user:", userId);

      const trips = await Trip.find({ user: userId })
        .populate("checklists") // Now this will work!
        .sort({ date: -1 });

      res.status(200).json({ trips });
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Get a single trip by ID
  getTripById: async (req, res) => {
    try {
      const { tripId } = req.params;
      console.log("Getting trip:", tripId);

      const trip = await Trip.findById(tripId)
        .populate("user", "username email")
        .populate("checklists");

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      res.status(200).json({ trip });
    } catch (error) {
      console.error("Error fetching trip:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Update a trip
  updateTrip: async (req, res) => {
    try {
      console.log("=== UPDATE TRIP DEBUG ===");
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);

      const { tripId } = req.params;
      const {
        title,
        location,
        formattedAddress,
        latitude,
        longitude,
        placeId,
        status,
        date,
        notes,
      } = req.body;

      // Find existing trip
      const existingTrip = await Trip.findById(tripId);
      if (!existingTrip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // Prepare update data
      const updateData = {
        title: title || existingTrip.title,
        location: location || existingTrip.location,
        formattedAddress: formattedAddress || existingTrip.formattedAddress,
        coordinates: {
          latitude: latitude
            ? parseFloat(latitude)
            : existingTrip.coordinates.latitude,
          longitude: longitude
            ? parseFloat(longitude)
            : existingTrip.coordinates.longitude,
        },
        placeId: placeId || existingTrip.placeId,
        date: date || existingTrip.date,
        notes: notes !== undefined ? notes : existingTrip.notes,
      };

      // Handle new photo uploads
      if (req.files && req.files.length > 0) {
        const newPhotos = req.files.map((file) => file.path);
        updateData.photos = [...existingTrip.photos, ...newPhotos];
        console.log("Added new photos:", newPhotos);
      }

      // Update the trip
      const updatedTrip = await Trip.findByIdAndUpdate(tripId, updateData, {
        new: true,
        runValidators: true,
      });

      console.log("Trip updated successfully:", updatedTrip._id);

      res.status(200).json({
        message: "Trip updated successfully",
        trip: updatedTrip,
      });
    } catch (error) {
      console.error("=== UPDATE TRIP ERROR ===");
      console.error("Error:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error",
          details: Object.keys(error.errors).map((key) => ({
            field: key,
            message: error.errors[key].message,
          })),
        });
      }

      res.status(500).json({
        message: "Server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Delete a trip
  deleteTrip: async (req, res) => {
    try {
      const { tripId } = req.params;
      console.log("Deleting trip:", tripId);

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // Delete all associated photos
      if (trip.photos && trip.photos.length > 0) {
        trip.photos.forEach((photoPath) => {
          try {
            const fullPath = path.join(process.cwd(), photoPath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
              console.log("Deleted photo:", fullPath);
            }
          } catch (error) {
            console.error("Error deleting photo:", error);
          }
        });
      }

      await Trip.findByIdAndDelete(tripId);

      res.status(200).json({ message: "Trip deleted successfully" });
    } catch (error) {
      console.error("Error deleting trip:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Add photos to existing trip
  addTripPhotos: async (req, res) => {
    try {
      const { tripId } = req.params;
      console.log("Adding photos to trip:", tripId);

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No photos provided" });
      }

      const newPhotos = req.files.map((file) => file.path);
      trip.photos.push(...newPhotos);
      await trip.save();

      res.status(200).json({
        message: "Photos added successfully",
        photos: trip.photos,
      });
    } catch (error) {
      console.error("Error adding photos:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Delete a specific photo from trip
  deleteTripPhoto: async (req, res) => {
    try {
      const { tripId, photoIndex } = req.params;
      console.log("Deleting photo from trip:", tripId, "index:", photoIndex);

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      const index = parseInt(photoIndex);
      if (index < 0 || index >= trip.photos.length) {
        return res.status(400).json({ message: "Invalid photo index" });
      }

      const photoPath = trip.photos[index];

      // Delete file from filesystem
      try {
        const fullPath = path.join(process.cwd(), photoPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log("Deleted photo file:", fullPath);
        }
      } catch (error) {
        console.error("Error deleting photo file:", error);
      }

      // Remove from array
      trip.photos.splice(index, 1);
      await trip.save();

      res.status(200).json({
        message: "Photo deleted successfully",
        photos: trip.photos,
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};
