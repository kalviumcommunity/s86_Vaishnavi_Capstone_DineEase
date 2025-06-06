const express = require('express');
const router = express.Router();
const { createInfoHub,getInfoHub, editInfoHub} = require('../controllers/infoHubController');
const verifyAdmin = require('../middleware/verifyAdmin'); 

// aroutes 
router.post('/create', verifyAdmin, createInfoHub);
router.get('/get', verifyAdmin, getInfoHub);
router.put('/edit', verifyAdmin, editInfoHub);


module.exports = router;
