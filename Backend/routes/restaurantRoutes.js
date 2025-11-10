const express = require('express');
const router = express.Router();

const { 
  getrestaurantProfile, 
  updaterestaurantProfile, 
  deleterestaurant, 
  getRestaurantStats, 
  updateInfoHub 
} = require('../controllers/restaurantController');

const auth = require('../middleware/auth'); // ✅ verify JWT token
const verifyRole = require('../middleware/verifyRole'); // ✅ role middleware

router.get('/:id', auth, verifyRole('restaurant'), getrestaurantProfile);
router.put('/:id', auth, verifyRole('restaurant'), updaterestaurantProfile);
router.delete('/:id', auth, verifyRole('restaurant'), deleterestaurant);

//stats
router.get('/:id/stats', auth, verifyRole('restaurant'), getRestaurantStats);

//info-hub
router.put('/:id/info-hub', auth, verifyRole('restaurant'), updateInfoHub);

module.exports = router;
