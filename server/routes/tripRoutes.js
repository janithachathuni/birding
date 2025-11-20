const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    addTripPhotos,
    deleteTripPhoto
} = require('../controllers/tripController');
const router = express.Router();

// Ensure upload directory exists
const uploadDir = 'uploads/trips/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created directory: ${uploadDir}`);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(`Saving trip photo to: ${uploadDir}`);
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
    console.log(`File filter check - mimetype: ${file.mimetype}`);
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
        fileSize: 8 * 1024 * 1024 // 8MB limit
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
    }
    
    if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({ message: 'Only image files are allowed!' });
    }
    
    return res.status(500).json({ message: 'File upload error', error: err.message });
};

// Trip CRUD Routes
router.post('/create', (req, res, next) => {
    console.log("=== TRIP CREATE ROUTE HIT ===");
    
    upload.array('photos', 10)(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        createTrip(req, res);
    });
});

router.get('/user/:userId', getAllTrips);

router.get('/:tripId', getTripById);

router.put('/:tripId', (req, res, next) => {
    console.log("=== TRIP UPDATE ROUTE HIT ===");
    
    upload.array('photos', 10)(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        updateTrip(req, res);
    });
});

router.delete('/:tripId', deleteTrip);

// Add more photos to existing trip
router.post('/:tripId/photos', (req, res, next) => {
    upload.array('photos', 10)(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        addTripPhotos(req, res);
    });
});

// Delete specific photo from trip
router.delete('/:tripId/photos/:photoIndex', deleteTripPhoto);

module.exports = router;