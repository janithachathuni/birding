const Profile = require('../models/Profile');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

module.exports = {
    createProfile: async (req, res) => {
        try {
            console.log("=== CREATE PROFILE DEBUG ===");
            console.log("Request body:", req.body);
            console.log("Request files:", req.files);
            console.log("Request user:", req.user);
            
            const { displayName, bio, userId: bodyUserId } = req.body;
            const userId = req.user?.id || bodyUserId;
            
            console.log("Extracted userId:", userId);
            console.log("Extracted displayName:", displayName);
            console.log("Extracted bio:", bio);
            
            // Check if files exist and log them
            const profilePic = req.files && req.files['profilePic'] ? req.files['profilePic'][0].path : null;
            const bannerPic = req.files && req.files['bannerPic'] ? req.files['bannerPic'][0].path : null;
            
            console.log("Profile pic path:", profilePic);
            console.log("Banner pic path:", bannerPic);

            if (!userId) {
                console.log("ERROR: No userId provided");
                return res.status(400).json({ message: "User ID is required" });
            }

            // Validate userId format (if using MongoDB ObjectId)
            if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
                console.log("ERROR: Invalid userId format:", userId);
                return res.status(400).json({ message: "Invalid user ID format" });
            }

            // Check if user exists first
            const user = await User.findById(userId);
            console.log("User found:", user ? "Yes" : "No");
            
            if (!user) {
                console.log("ERROR: User not found with ID:", userId);
                return res.status(404).json({ message: "User not found" });
            }

            // Check if profile already exists
            const existingProfile = await Profile.findOne({ user: userId });
            console.log("Existing profile found:", existingProfile ? "Yes" : "No");
            
            if (existingProfile) {
                console.log("ERROR: Profile already exists for user:", userId);
                return res.status(400).json({ message: "Profile already exists" });
            }

            // Create profile object
            const profileData = {
                user: userId,
                displayName: displayName || 'Anonymous Birder',
                bio: bio || '',
                profilePic,
                bannerPic
            };
            
            console.log("Profile data to save:", profileData);

            // Create new profile
            const profile = new Profile(profileData);
            console.log("Profile object created");
            
            const savedProfile = await profile.save();
            console.log("Profile saved successfully:", savedProfile._id);

            // Update user's profileCompleted status and isFirstLogin
            const updatedUser = await User.findByIdAndUpdate(
                userId, 
                { 
                    profileCompleted: true,
                    isFirstLogin: false
                },
                { new: true } // Return updated document
            );
            console.log("User updated:", updatedUser ? "Yes" : "No");

            const responseData = {
                message: "Profile created successfully", 
                profile: {
                    id: savedProfile._id,
                    displayName: savedProfile.displayName,
                    bio: savedProfile.bio,
                    profilePic: savedProfile.profilePic,
                    bannerPic: savedProfile.bannerPic
                }
            };
            
            console.log("Sending response:", responseData);
            res.status(201).json(responseData);
            
        } catch (error) {
            console.error("=== DETAILED ERROR INFORMATION ===");
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            
            if (error.name === 'ValidationError') {
                console.error("Validation errors:", error.errors);
                return res.status(400).json({ 
                    message: "Validation error", 
                    details: Object.keys(error.errors).map(key => ({
                        field: key,
                        message: error.errors[key].message
                    }))
                });
            }
            
            if (error.name === 'MongoError' || error.name === 'MongooseError') {
                console.error("Database error details:", error);
                return res.status(500).json({ message: "Database error occurred" });
            }
            
            res.status(500).json({ 
                message: "Server error", 
                error: process.env.NODE_ENV === 'development' ? error.message : undefined 
            });
        }
    },

    editProfile: async (req, res) => {
        try {
            console.log("=== EDIT PROFILE DEBUG ===");
            console.log("Request body:", req.body);
            console.log("Request files:", req.files);
            console.log("Request params:", req.params);
            
            const { displayName, bio } = req.body;
            const userId = req.params.userId;
            
            console.log("Extracted userId:", userId);
            console.log("Extracted displayName:", displayName);
            console.log("Extracted bio:", bio);
            
            if (!userId) {
                console.log("ERROR: No userId provided");
                return res.status(400).json({ message: "User ID is required" });
            }

            // Validate userId format (if using MongoDB ObjectId)
            if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
                console.log("ERROR: Invalid userId format:", userId);
                return res.status(400).json({ message: "Invalid user ID format" });
            }

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                console.log("ERROR: User not found with ID:", userId);
                return res.status(404).json({ message: "User not found" });
            }

            // Find existing profile
            const existingProfile = await Profile.findOne({ user: userId });
            if (!existingProfile) {
                console.log("ERROR: Profile not found for user:", userId);
                return res.status(404).json({ message: "Profile not found" });
            }

            // Prepare update data
            const updateData = {
                displayName: displayName || existingProfile.displayName,
                bio: bio !== undefined ? bio : existingProfile.bio,
            };

            // Handle file uploads
            let oldProfilePic = null;
            let oldBannerPic = null;

            if (req.files && req.files['profilePic']) {
                oldProfilePic = existingProfile.profilePic;
                updateData.profilePic = req.files['profilePic'][0].path;
                console.log("New profile pic path:", updateData.profilePic);
            }

            if (req.files && req.files['bannerPic']) {
                oldBannerPic = existingProfile.bannerPic;
                updateData.bannerPic = req.files['bannerPic'][0].path;
                console.log("New banner pic path:", updateData.bannerPic);
            }

            console.log("Update data:", updateData);

            // Update the profile
            const updatedProfile = await Profile.findOneAndUpdate(
                { user: userId },
                updateData,
                { new: true, runValidators: true }
            );

            console.log("Profile updated successfully:", updatedProfile._id);

            // Delete old image files if new ones were uploaded
            if (oldProfilePic && updateData.profilePic) {
                try {
                    const oldProfilePath = path.join(process.cwd(), oldProfilePic);
                    if (fs.existsSync(oldProfilePath)) {
                        fs.unlinkSync(oldProfilePath);
                        console.log("Deleted old profile pic:", oldProfilePath);
                    }
                } catch (error) {
                    console.error("Error deleting old profile pic:", error);
                }
            }

            if (oldBannerPic && updateData.bannerPic) {
                try {
                    const oldBannerPath = path.join(process.cwd(), oldBannerPic);
                    if (fs.existsSync(oldBannerPath)) {
                        fs.unlinkSync(oldBannerPath);
                        console.log("Deleted old banner pic:", oldBannerPath);
                    }
                } catch (error) {
                    console.error("Error deleting old banner pic:", error);
                }
            }

            const responseData = {
                message: "Profile updated successfully",
                profile: {
                    id: updatedProfile._id,
                    displayName: updatedProfile.displayName,
                    bio: updatedProfile.bio,
                    profilePic: updatedProfile.profilePic,
                    bannerPic: updatedProfile.bannerPic
                }
            };

            console.log("Sending response:", responseData);
            res.status(200).json(responseData);

        } catch (error) {
            console.error("=== EDIT PROFILE ERROR ===");
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);

            if (error.name === 'ValidationError') {
                console.error("Validation errors:", error.errors);
                return res.status(400).json({
                    message: "Validation error",
                    details: Object.keys(error.errors).map(key => ({
                        field: key,
                        message: error.errors[key].message
                    }))
                });
            }

            if (error.name === 'MongoError' || error.name === 'MongooseError') {
                console.error("Database error details:", error);
                return res.status(500).json({ message: "Database error occurred" });
            }

            res.status(500).json({
                message: "Server error",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Check if user is first time login
    checkFirstLogin: async (req, res) => {
        try {
            const { userId } = req.params;
            console.log("Checking first login for user:", userId);
            
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({ 
                isFirstLogin: user.isFirstLogin,
                profileCompleted: user.profileCompleted
            });
            
        } catch (error) {
            console.error("Error checking first login:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Complete the profile setup (even if skipped)
    completeSetup: async (req, res) => {
        try {
            const { userId } = req.params;
            console.log("Completing setup for user:", userId);
            
            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check if profile exists, if not create a basic one
            let profile = await Profile.findOne({ user: userId });
            if (!profile) {
                profile = new Profile({
                    user: userId,
                    displayName: user.username || 'Anonymous Birder',
                    bio: '',
                    profilePic: null,
                    bannerPic: null
                });
                await profile.save();
            }

            // Update user status
            await User.findByIdAndUpdate(userId, { 
                profileCompleted: true,
                isFirstLogin: false
            });

            res.json({ message: "Profile setup completed successfully" });
            
        } catch (error) {
            console.error("Error completing setup:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Get user profile
    getProfile: async (req, res) => {
        try {
            const { userId } = req.params;
            console.log("Getting profile for user:", userId);
            
            const profile = await Profile.findOne({ user: userId });
            if (!profile) {
                return res.status(404).json({ message: "Profile not found" });
            }

            res.json({ profile });
            
        } catch (error) {
            console.error("Error fetching profile:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
};