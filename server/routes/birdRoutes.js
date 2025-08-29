 const express = require('express');
 const {addBird} = require('../controllers/birdController');
 const router = express.Router();

 //bird routes
 router.post('/add', addBird)
 module.exports = router;