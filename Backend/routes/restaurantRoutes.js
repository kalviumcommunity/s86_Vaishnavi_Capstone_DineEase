const express = require('express');
const router = express.Router();

const { 
  getrestaurantProfile, 
  updaterestaurantProfile, 
  deleterestaurant, 
  getRestaurantStats, 
  updateInfoHub,
  getAllRestaurants,
  getRestaurantById
} = require('../controllers/restaurantController');

const auth = require('../middleware/auth'); // ✅ verify JWT token
const verifyRole = require('../middleware/verifyRole'); // ✅ role middleware
const { uploadBothImages } = require('../middleware/upload'); // ✅ multer upload

// PUBLIC ROUTES (for users to browse restaurants)
router.get('/browse/all', getAllRestaurants);
router.get('/browse/:id', getRestaurantById);

// PROTECTED ROUTES (for restaurant owners)
router.get('/:id', auth, verifyRole('restaurant'), getrestaurantProfile);
router.put('/:id', auth, verifyRole('restaurant'), updaterestaurantProfile);
router.delete('/:id', auth, verifyRole('restaurant'), deleterestaurant);

//stats
router.get('/:id/stats', auth, verifyRole('restaurant'), getRestaurantStats);

//info-hub with image upload
router.put('/:id/info-hub', auth, verifyRole('restaurant'), uploadBothImages, updateInfoHub);

module.exports = router;
