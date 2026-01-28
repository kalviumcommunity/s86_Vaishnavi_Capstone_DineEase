const express = require('express');
const router = express.Router();
const {createTable, getTables, updateTable, deleteTable, getTablesByRestaurant} = require('../controllers/tableController');
const auth = require("../middleware/auth");
const  verifyRole = require('../middleware/verifyRole');

// PUBLIC ROUTE - Get tables by restaurant ID (for users)
router.get('/restaurant/:restaurantId', getTablesByRestaurant);

// PROTECTED ROUTES - Restaurant table management
router.post('/add', auth, verifyRole("restaurant"), createTable);
router.get('/all', auth, verifyRole("restaurant"), getTables);
router.put('/:id', auth, verifyRole("restaurant"), updateTable);
router.delete('/:id', auth, verifyRole("restaurant"), deleteTable);


module.exports = router;