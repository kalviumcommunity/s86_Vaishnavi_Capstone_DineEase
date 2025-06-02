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
