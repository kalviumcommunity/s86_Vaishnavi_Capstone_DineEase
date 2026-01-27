const User = require('../models/user');


// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    // Use authenticated user's ID from token
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
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
    // Use authenticated user's ID from token
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
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


// Delete user account
exports.deleteUser = async (req, res) => {
  try {
    // Use authenticated user's ID from token
    const userId = req.user.id;
    const removedUser = await User.findByIdAndDelete(userId);
    if (!removedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};