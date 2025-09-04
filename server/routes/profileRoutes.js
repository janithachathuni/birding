const express = require('express');
const multer = require('multer');
const path = require('path');
const { createProfile, checkFirstLogin, completeSetup, getProfile } = require('../controllers/profileController');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Routes
router.post('/create', upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'bannerPic', maxCount: 1 }
]), createProfile);

router.get('/check-first-login/:userId', checkFirstLogin);
router.put('/complete-setup/:userId', completeSetup);
router.get('/:userId', getProfile);

module.exports = router;