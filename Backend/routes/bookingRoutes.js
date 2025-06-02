const express = require('express');
const router = express.Router();

const { createBooking} = require('../controllers/bookingController');

const auth = require('../middleware/auth'); 

//creating a  booking
router.post('/book', auth, createBooking);


module.exports = router;
