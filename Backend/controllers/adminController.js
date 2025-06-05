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