const InfoHub = require('../models/infoHub');

// Create InfoHub
exports.createInfoHub = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { aboutUs, location, phone, timings, menuImages, restaurantImages } = req.body;

    const exists = await InfoHub.findOne({ adminId });
    
    if (exists) {
      return res.status(400).json({ message: 'Info already exists' });
    }

    const newInfo = new InfoHub({
      adminId,
      aboutUs,
      location,
      phone,
      timings,
      menuImages,
      restaurantImages
    });

    await newInfo.save();
    res.status(201).json({ message: 'Info created', data: newInfo });
  } catch (error) {
    res.status(500).json({ message: 'Error creating info', error: error.message });
    console.log('Erround found: ',error)
  }
};


// Get InfoHub by Admin
exports.getInfoHub = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const info = await InfoHub.findOne({ adminId });

    if (!info) {
      return res.status(404).json({ message: 'Info not found' });
    }

    res.status(200).json({ data: info });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving info', error: error.message });
  }
};



// Edit InfoHub
exports.editInfoHub = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { aboutUs, location, contact, timings, menuImages, restaurantImages } = req.body;

    const updatedInfo = await InfoHub.findOneAndUpdate(
      { adminId },
      { aboutUs, location, contact, timings, menuImages, restaurantImages },
      { new: true }
    );

    if (!updatedInfo) {
      return res.status(404).json({ message: 'Info not found for editing' });
    }

    res.status(200).json({ message: 'Info updated', data: updatedInfo });
  } catch (error) {
    res.status(500).json({ message: 'Error editing info', error: error.message });
  }
};
