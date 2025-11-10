const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  deleteBooking,
  getPendingBookings,
  confirmBookings,
  cancelBookings,
  getConfirmedBookings,
  updateArrivalStatus
} = require('../controllers/bookingController');

const auth = require('../middleware/auth');
const verifyRole = require('../middleware/verifyRole');

//USER ROUTES
router.post('/book', auth, verifyRole("user"), createBooking);
router.get('/all', auth, verifyRole("user"), getMyBookings);
router.delete('/:id', auth, verifyRole("user"), deleteBooking);

//RESTAURANT ROUTES
router.get('/pending', auth, verifyRole("restaurant"), getPendingBookings);
router.put('/confirm/:id', auth, verifyRole("restaurant"), confirmBookings);
router.put('/cancel/:id', auth, verifyRole("restaurant"), cancelBookings);
router.get('/confirmed', auth, verifyRole("restaurant"), getConfirmedBookings);
router.put('/arrival/:id', auth, verifyRole("restaurant"), updateArrivalStatus);

module.exports = router;
