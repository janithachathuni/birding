const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    createPost,
    getAllPosts,
    getPostById,
    getPostsByUser,
    getPostsByBird,
    updatePost,
    deletePost,
    toggleLike,
    hidePost,
    searchPosts
} = require('../controllers/postController');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = 'uploads/posts/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created directory: ${uploadDir}`);
}

// Configure multer for post images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(`Saving post image to: ${uploadDir}`);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'post-' + uniqueSuffix + path.extname(file.originalname);
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

// Create different upload configurations
const singleUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for single image
    }
}).single('image');

const multipleUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per image
        files: 10 // Maximum 10 images per post
    }
}).array('images', 10);

// Custom error handler for multer
const handleMulterError = (err, req, res, next) => {
    console.error("Multer error:", err);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 10MB per image.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: 'Too many files uploaded. Maximum 10 images per post.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: 'Unexpected file field.' });
        }
    }
    
    if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({ error: 'Only image files are allowed!' });
    }
    
    return res.status(500).json({ error: 'File upload error', details: err.message });
};

// Helper middleware to process multiple images
const processPostImages = (req, res, next) => {
    multipleUpload(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        
        console.log(`Files uploaded: ${req.files ? req.files.length : 0}`);
        
        // Convert uploaded files to the required format
        if (req.files && req.files.length > 0) {
            // Parse the images data from body if provided
            let imagesData = [];
            if (req.body.imagesData) {
                try {
                    imagesData = JSON.parse(req.body.imagesData);
                } catch (error) {
                    console.error('Error parsing imagesData:', error);
                    return res.status(400).json({ error: 'Invalid images data format' });
                }
            }
            
            // Create images array for the post
            req.body.images = req.files.map((file, index) => {
                const imageData = imagesData[index] || {};
                return {
                    imageUrl: `/uploads/posts/${file.filename}`,
                    birds: imageData.birds || [],
                    location: imageData.location || null
                };
            });
        }
        
        next();
    });
};

// Middleware to process single image (for testing or update)
const processSingleImage = (req, res, next) => {
    singleUpload(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        
        if (req.file) {
            req.body.imageUrl = `/uploads/posts/${req.file.filename}`;
        }
        
        next();
    });
};

// POST ROUTES
// Create post with multiple images
router.post('/', (req, res, next) => {
    console.log("=== CREATE POST ROUTE HIT ===");
    console.log("Body before multer:", req.body);
    
    processPostImages(req, res, (err) => {
        if (err) return next(err);
        
        console.log("Files processed by multer:", req.files?.length || 0);
        console.log("Images data:", req.body.imagesData ? "Present" : "Missing");
        
        createPost(req, res);
    });
});

// Get all posts
router.get('/', getAllPosts);

// Search posts
router.get('/search', searchPosts);

// Get posts by user
router.get('/user/:userId', getPostsByUser);

// Get posts by bird
router.get('/bird/:birdId', getPostsByBird);

// Get single post
router.get('/:id', getPostById);

// Update post (only caption, location, hashtags - not images)
router.put('/:id', updatePost);

// Delete post
router.delete('/:id', deletePost);

// Like/Unlike post
router.post('/:id/like', toggleLike);

// Hide post
router.post('/:id/hide', hidePost);

module.exports = router;