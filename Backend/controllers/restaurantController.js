const Restaurant = require('../models/Restaurant');
const Booking = require('../models/booking');
const Table = require('../models/table');


// GET - restaurant Profile
exports.getrestaurantProfile = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select('-password');
    if (!restaurant) {
      return res.status(404).json({ message: 'restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Get restaurant Profile Error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};


// PUT - Update restaurant Profile
exports.updaterestaurantProfile = async (req, res) => {
  try {
    const updatedrestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    if (!updatedrestaurant) {
      return res.status(404).json({ message: 'restaurant not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      data: updatedrestaurant
    });
  } catch (error) {
    console.error('Update restaurant Profile Error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};


// Delete  restaurant account
exports.deleterestaurant = async (req, res) => {
  try {
    const removedrestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!removedrestaurant) {
      return res.status(404).json({ message: 'restaurant not found' });
    }
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete restaurant Error:', error);
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

exports.getRestaurantStats = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    
    const totalTables = await Table.countDocuments({ RestaurantId: restaurantId });
    const availableTables = await Table.countDocuments({ RestaurantId: restaurantId, available: true });

  
    const totalReservations = await Booking.countDocuments({ restaurantId });
    const pendingReservations = await Booking.countDocuments({ restaurantId, status: 'pending' });

    res.status(200).json({
      message: "Restaurant stats fetched successfully",
      stats: {
        totalTables,
        availableTables,
        totalReservations,
        pendingReservations
      }
    });

  } catch (error) {
    console.error("Get Restaurant Stats Error:", error);
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};


//  Update Info Hub
exports.updateInfoHub = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const updateFields = {
      aboutUs: req.body.aboutUs,
      timings: req.body.timings,
      city: req.body.city,
      state: req.body.state,
      menuimages: req.body.menuimages,           // array
      restaurantImages: req.body.restaurantImages // array
    };

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      message: "Info Hub updated successfully",
      data: updatedRestaurant
    });

  } catch (error) {
    console.error("Update Info Hub Error:", error);
    res.status(500).json({ message: "Error updating Info Hub", error: error.message });
  }
};
