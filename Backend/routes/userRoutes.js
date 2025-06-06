const express = require('express');
const router = express.Router();

const {userSignup,userLogin} = require('../controllers/authController');
const { getAllUsers, getUserProfile , updateUserProfile } = require('../controllers/userController');

// user signup & login
router.post('/signup',userSignup );
router.post('/login',userLogin );

router.get('/all', getAllUsers);
router.get('/:id', getUserProfile);
router.put('/:id', updateUserProfile);


module.exports = router;