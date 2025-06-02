const express = require('express');
const router = express.Router();
const { createInfoHub} = require('../controllers/infoHubController');
const verifyAdmin = require('../middleware/verifyAdmin'); 

// adding InfoHub 
router.post('/create', verifyAdmin, createInfoHub);


module.exports = router;
