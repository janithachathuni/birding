const Profile = require('../models/Profile');
const User = require('../models/User');

module.exports = {
    createProfile: async (req, res) => {
        try {
            const { displayName, bio } = req.body;
            const userId = req.user.id; // Assuming user ID is available in req.user
            const profilePic = req.files['profilePic'] ? req.files['profilePic'][0].path : null;
            const bannerPic = req.files['bannerPic'] ? req.files['bannerPic'][0].path : null;
            console.log("Creating profile for user:", userId);

            // Check if profile already exists
            const existingProfile = await Profile.findOne({ user: userId });
            if (existingProfile) {
                return res.status(400).json({ message: "Profile already exists" });
            }else{
            // Create new profile
            const profile = new Profile({
                user: userId,
                displayName,
                bio,
                profilePic,
                bannerPic
            })
            
            await profile.save();

            // Update user's profileCompleted status
            await User.findByIdAndUpdate(userId, { profileCompleted: true });

            res.status(201).json({ message: "Profile created successfully", profile });
        }catch (error) {
            console.error("Error creating profile:", error);
            res.status(500).json({ message: "Server error" });
        }

    }
}