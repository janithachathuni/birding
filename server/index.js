const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

//route imports
const authRoutes = require('./routes/authRoutes');
const birdRoutes = require('./routes/birdRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/users');
const tripRoutes = require('./routes/tripRoutes');
const checklistRoutes = require('./routes/checklistRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDirs = ['uploads', 'uploads/profiles', 'uploads/trips']; // ADD 'uploads/trips'
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/kurullo')
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/birds', birdRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/checklists', checklistRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large' });
        }
    }
    res.status(500).json({ message: error.message });
});

// Export the app instead of calling app.listen()
module.exports = app;