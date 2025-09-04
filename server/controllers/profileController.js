const Profile = require('../models/Profile');
const User = require('../models/User');

module.exports = {
    createProfile: async (req, res) => {
        try {
            const { displayName, bio } = req.body;
            const userId = req.user?.id || req.body.userId; // Support both middleware and direct userId
            const profilePic = req.files && req.files['profilePic'] ? req.files['profilePic'][0].path : null;
            const bannerPic = req.files && req.files['bannerPic'] ? req.files['bannerPic'][0].path : null;
            
            console.log("Creating profile for user:", userId);

            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }

            // Check if profile already exists
            const existingProfile = await Profile.findOne({ user: userId });
            if (existingProfile) {
                return res.status(400).json({ message: "Profile already exists" });
            }

            // Create new profile
            const profile = new Profile({
                user: userId,
                displayName: displayName || 'Anonymous Birder', // Default name if not provided
                bio: bio || '',
                profilePic,
                bannerPic
            });
            
            await profile.save();

            // Update user's profileCompleted status and isFirstLogin
            await User.findByIdAndUpdate(userId, { 
                profileCompleted: true,
                isFirstLogin: false
            });

            res.status(201).json({ 
                message: "Profile created successfully", 
                profile: {
                    id: profile._id,
                    displayName: profile.displayName,
                    bio: profile.bio,
                    profilePic: profile.profilePic,
                    bannerPic: profile.bannerPic
                }
            });
            
        } catch (error) {
            console.error("Error creating profile:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // Check if user is first time login
    checkFirstLogin: async (req, res) => {
        try {
            const { userId } = req.params;
            
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
            
            const profile = await Profile.findOne({ user: userId }).populate('user', 'username email');
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