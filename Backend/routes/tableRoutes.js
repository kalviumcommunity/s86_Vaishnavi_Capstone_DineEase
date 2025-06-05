const express = require('express');
const router = express.Router();
const {createTable,getTables} = require('../controllers/tableController');
const  verifyAdmin = require('../middleware/verifyAdmin');

// Create a new table
router.post('/add', verifyAdmin, createTable);
router.get('/', verifyAdmin, getTables);


module.exports = router;