const express = require('express');
const router = express.Router();

// const {userSignup,userLogin} = require('../controllers/authController');
const { getAllUsers, getUserProfile , updateUserProfile , deleteUser} = require('../controllers/userController');
const auth = require('../middleware/auth');
const verifyRole = require('../middleware/verifyRole');


// // user signup & login
// router.post('/signup',userSignup );
// router.post('/login',userLogin );

router.get('/profile', auth, verifyRole('user'), getUserProfile);
router.put('/profile', auth, verifyRole('user'), updateUserProfile);
router.delete('/profile', auth, verifyRole('user'), deleteUser);


module.exports = router;