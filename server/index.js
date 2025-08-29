const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const birdRoutes = require('./routes/birdRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/kurullo')
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/birds', birdRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Export the app instead of calling app.listen()
module.exports = app;