const express = require('express');
const router = express.Router();

const { adminSignup, adminLogin } = require('../controllers/authController');
const{getAdminProfile, updateAdminProfile , deleteAdmin} = require('../controllers/adminController')
const verifyAdmin = require('../middleware/verifyAdmin'); 


router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.get('/:id', verifyAdmin, getAdminProfile);
router.put('/:id', verifyAdmin, updateAdminProfile);
router.delete('/:id', verifyAdmin, deleteAdmin);


module.exports = router;
