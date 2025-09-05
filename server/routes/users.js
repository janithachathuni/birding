const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/User');
const Profile = require('../models/Profile'); // Import the Profile model

const router = express.Router();

// GET user and profile by username
router.get('/username/:username', async (req, res) => {
  try {
    // 1. Get username from URL and convert to lowercase for consistent lookup
    const usernameFromParam = req.params.username.toLowerCase();

    // 2. Find the user by username, excluding the password
    const user = await User.findOne({ username: usernameFromParam }).select('-password');

    // 3. If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // 4. Find the associated profile using the user's ID
    const profile = await Profile.findOne({ user: user._id });

    // 5. If profile is not found, you can still return the user or handle as an error
    // For this case, we'll return the user with a null profile to avoid breaking the frontend
    if (!profile) {
      return res.status(200).json({
        success: true,
        user: user,
        profile: null, // Indicate that the profile doesn't exist
        message: 'User found, but profile data is missing.'
      });
    }

    // 6. If both user and profile are found, return them
    res.json({
      success: true,
      user: user,
      profile: profile
    });
    
  } catch (error) {
    console.error('Error fetching user and profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;