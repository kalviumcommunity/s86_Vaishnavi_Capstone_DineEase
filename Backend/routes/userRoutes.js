const express = require('express');
const router = express.Router();

const { getAllUsers, getUserProfile , updateUserProfile , deleteUser} = require('../controllers/userController');
const auth = require('../middleware/auth');
const verifyRole = require('../middleware/verifyRole');


router.get('/:id',auth, verifyRole('user'), getUserProfile);
router.put('/:id',auth, verifyRole('user'), updateUserProfile);
router.delete('/:id',auth, verifyRole('user'), deleteUser);


module.exports = router;