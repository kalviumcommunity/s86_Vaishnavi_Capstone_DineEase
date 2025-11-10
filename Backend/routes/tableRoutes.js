const express = require('express');
const router = express.Router();
const {createTable,getTables , updateTable , deleteTable} = require('../controllers/tableController');
const auth = require("../middleware/auth");
const  verifyRole = require('../middleware/verifyRole');

// Create a new table
router.post('/add', auth, verifyRole("restaurant"), createTable);
router.get('/all', auth, verifyRole("restaurant"), getTables);
router.put('/:id', auth, verifyRole("restaurant"), updateTable);
router.delete('/:id', auth, verifyRole("restaurant"), deleteTable);


module.exports = router;