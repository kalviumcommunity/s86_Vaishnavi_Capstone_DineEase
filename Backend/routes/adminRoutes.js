const express = require('express');
const router = express.Router();

const { adminSignup, adminLogin } = require('../controllers/authController');
const{getAdminProfile} = require('../controllers/adminController')
const verifyAdmin = require('../middleware/verifyAdmin'); 

// Admin Signup & Login
router.post('/signup', adminSignup);
router.post('/login', adminLogin);


router.get('/:id', verifyAdmin, getAdminProfile);

module.exports = router;
