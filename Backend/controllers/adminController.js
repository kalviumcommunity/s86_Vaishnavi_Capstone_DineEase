const Admin = require('../models/admin');

// GET - Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error('Get Admin Profile Error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};



// PUT - Update Admin Profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      data: updatedAdmin
    });
  } catch (error) {
    console.error('Update Admin Profile Error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};


// Delete  admin account
exports.deleteAdmin = async (req, res) => {
  try {
    const removedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!removedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete Admin Error:', error);
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};
