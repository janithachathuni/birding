const User = require('../models/User');

// Register controller
exports.register = async (req, res) => {
  try {
    console.log("Register request received:", req.body);
    
    const { username, email, password, moderator } = req.body;
    
    // Check if all required fields are present
    if (!username || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Username validation (letters, numbers, dash only)
    const usernameRegex = /^[A-Za-z0-9-]+$/;
    if (!usernameRegex.test(username)) {
      console.log("Invalid username format:", username);
      return res.status(400).json({ message: "Username can only contain letters, numbers, and dashes" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Create new user with moderator field
    const user = await User.create({ 
      username, 
      email, 
      password,
      moderator: moderator || false,  // Explicitly set moderator field
      isFirstLogin: true,
      profileCompleted: false
    });
    
    console.log("User created successfully:", user.email);
    console.log("User moderator status:", user.moderator);
    
    res.status(201).json({ 
      message: "Account created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        moderator: user.moderator,
        isFirstLogin: user.isFirstLogin,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    console.log("Registration error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Login controller (unchanged)
exports.login = async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not registered" });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    console.log("Login successful for user:", email);
    console.log("User moderator status:", user.moderator);
    
    // Return user data
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        moderator: user.moderator,
        isFirstLogin: user.isFirstLogin,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};
