const express = require('express');
const router = express.Router();
const { createBooking,getMyBookings} = require('../controllers/bookingController');
const auth = require('../middleware/auth'); 


router.post('/book', auth, createBooking);
router.get('/all', auth , getMyBookings);

module.exports = router;
