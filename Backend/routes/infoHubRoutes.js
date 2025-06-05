const express = require('express');
const router = express.Router();
const { createInfoHub,getInfoHub} = require('../controllers/infoHubController');
const verifyAdmin = require('../middleware/verifyAdmin'); 

// adding InfoHub 
router.post('/create', verifyAdmin, createInfoHub);
router.get('/get', verifyAdmin, getInfoHub);


module.exports = router;
