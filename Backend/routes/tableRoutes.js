const express = require('express');
const router = express.Router();
const {createTable,getTables , updateTable , deleteTable} = require('../controllers/tableController');
const  verifyAdmin = require('../middleware/verifyAdmin');

// Create a new table
router.post('/add', verifyAdmin, createTable);
router.get('/all', verifyAdmin, getTables);
router.put('/:id', verifyAdmin, updateTable);
router.delete('/:id', verifyAdmin, deleteTable);


module.exports = router;