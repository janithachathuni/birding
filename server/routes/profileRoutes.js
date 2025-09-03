const express = require('express');
const { createProfile } = require('../controllers/profileController');
const router = express.Router();

router.post('/create', createProfile);

module.exports = router;