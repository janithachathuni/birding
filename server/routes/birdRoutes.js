 const express = require('express');
 const {addBird, getAllBirds, deleteBird} = require('../controllers/birdController');
 const router = express.Router();

 //bird routes
 router.post('/add', addBird)
 router.get('/get', getAllBirds)
router.delete('/delete/:id', deleteBird);
router.delete('/delete/:id', deleteBird);
 module.exports = router;