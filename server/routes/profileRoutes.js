const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createProfile, editProfile, checkFirstLogin, completeSetup, getProfile } = require('../controllers/profileController');
const router = express.Router();

// Ensure upload directory exists
const uploadDir = 'uploads/profiles/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created directory: ${uploadDir}`);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(`Saving file to: ${uploadDir}`);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        console.log(`Generated filename: ${filename}`);
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    console.log(`File filter check - mimetype: ${file.mimetype}, fieldname: ${file.fieldname}`);
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        console.log(`Rejected file: ${file.originalname} - not an image`);
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 8 * 1024 * 1024 // 8MB limit (increased from 5MB)
    }
});

// Custom error handler for multer
const handleMulterError = (err, req, res, next) => {
    console.error("Multer error:", err);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 8MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ message: 'Too many files uploaded.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ message: 'Unexpected file field.' });
        }
    }
    
    if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({ message: 'Only image files are allowed!' });
    }
    
    return res.status(500).json({ message: 'File upload error', error: err.message });
};

// Multer middleware wrapper for reusability
const uploadMiddleware = upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'bannerPic', maxCount: 1 }
]);

// Routes
router.post('/create', (req, res, next) => {
    console.log("=== PROFILE CREATE ROUTE HIT ===");
    console.log("Headers:", req.headers);
    console.log("Body before multer:", req.body);
    
    uploadMiddleware(req, res, (err) => {
        if (err) {
            console.error("Upload middleware error:", err);
            return handleMulterError(err, req, res, next);
        }
        
        console.log("Files processed by multer:", req.files);
        console.log("Body after multer:", req.body);
        
        // Call the controller
        createProfile(req, res);
    });
});

router.put('/edit/:userId', (req, res, next) => {
    console.log("=== PROFILE EDIT ROUTE HIT ===");
    console.log("Headers:", req.headers);
    console.log("Body before multer:", req.body);
    console.log("Params:", req.params);
    
    uploadMiddleware(req, res, (err) => {
        if (err) {
            console.error("Upload middleware error:", err);
            return handleMulterError(err, req, res, next);
        }
        
        console.log("Files processed by multer:", req.files);
        console.log("Body after multer:", req.body);
        
        // Call the controller
        editProfile(req, res);
    });
});

router.get('/check-first-login/:userId', (req, res) => {
    console.log(`Checking first login for user: ${req.params.userId}`);
    checkFirstLogin(req, res);
});

router.put('/complete-setup/:userId', (req, res) => {
    console.log(`Completing setup for user: ${req.params.userId}`);
    completeSetup(req, res);
});

router.get('/:userId', (req, res) => {
    console.log(`Getting profile for user: ${req.params.userId}`);
    getProfile(req, res);
});

module.exports = router;