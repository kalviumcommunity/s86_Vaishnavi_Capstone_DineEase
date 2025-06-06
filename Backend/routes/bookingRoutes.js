const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getPendingReservations,
  confirmReservation,
  cancelReservation,
  getConfirmedReservations,
  updateArrivalStatus,
} = require('../controllers/bookingController');

const auth = require('../middleware/auth');       
const verifyAdmin = require('../middleware/verifyAdmin'); 

// USER ROUTES
router.post('/book', auth, createBooking);
router.get('/all', auth, getMyBookings);

// ADMIN ROUTES
router.get('/pending', verifyAdmin, getPendingReservations);              
router.put('/confirm/:id', verifyAdmin, confirmReservation);              
router.put('/cancel/:id', verifyAdmin, cancelReservation);                
router.get('/confirmed', verifyAdmin, getConfirmedReservations);          
router.put('/arrival/:id', verifyAdmin, updateArrivalStatus);             

module.exports = router;
