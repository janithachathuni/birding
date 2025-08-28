const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware');

// Route imports
const authRoutes = require('./routes/authRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route is working!' });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Bird Watching API' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Log registered routes
console.log('Registered routes:');
console.log('- GET /');
console.log('- GET /api/test');
console.log('- POST /api/auth/register');
console.log('- POST /api/auth/login');

module.exports = app;