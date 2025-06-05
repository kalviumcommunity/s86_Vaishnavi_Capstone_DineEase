const express = require('express');
const router = express.Router();

const {userSignup,userLogin} = require('../controllers/authController');
const { getAllUsers, getUserProfile } = require('../controllers/userController');

// user signup & login
router.post('/signup',userSignup );
router.post('/login',userLogin );

router.get('/all', getAllUsers);
router.get('/:id', getUserProfile);


module.exports = router;