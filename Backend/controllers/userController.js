const User = require('../models/user');

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide passwords
    res.status(200).json(users);
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};


// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.log('Update User Profile Error:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};