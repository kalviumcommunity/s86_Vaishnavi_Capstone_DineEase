const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const verifyAdmin = require('../middleware/verifyAdmin');



// GET pending
router.get('/pending', verifyAdmin, reservationController.getPendingReservations);



module.exports = router;