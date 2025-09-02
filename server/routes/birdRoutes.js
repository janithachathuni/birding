const express = require('express');
const {addBird, getAllBirds, deleteBird, getBirdById, editBird} = require('../controllers/birdController');
const router = express.Router();

// Bird routes
router.post('/add', addBird);
router.get('/get', getAllBirds);
router.get('/get/:id', getBirdById);  // Missing route - needed for edit and view
router.put('/edit/:id', editBird);    // Missing route - needed for updates
router.delete('/delete/:id', deleteBird);

module.exports = router;