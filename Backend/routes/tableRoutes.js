const express = require('express');
const router = express.Router();
const {createTable} = require('../controllers/tableController');
const  verifyAdmin = require('../middleware/verifyAdmin');

// Create a new table
router.post('/add', verifyAdmin, createTable);

module.exports = router;