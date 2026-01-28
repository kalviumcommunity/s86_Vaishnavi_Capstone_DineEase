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

    // ✅ Table Stats
    const totalTables = await Table.countDocuments({ RestaurantId: restaurantId });
    const availableTables = await Table.countDocuments({ RestaurantId: restaurantId, available: true });

    // ✅ Reservation Stats
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
    console.log("\n=== UPDATE INFO HUB STARTED ===");
    const restaurantId = req.params.id;
    console.log("Restaurant ID:", restaurantId);
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);
    console.log("Auth User:", req.user);

    // Get existing restaurant data to preserve existing images
    const existingRestaurant = await Restaurant.findById(restaurantId);
    if (!existingRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Build update fields
    const updateFields = {
      aboutUs: req.body.aboutUs,
      timings: req.body.timings,
      city: req.body.city,
      state: req.body.state,
      location: req.body.location,
      phoneNumber: req.body.phoneNumber,
    };

    // Handle menu images - use existing images sent from frontend, then add new uploads
    let menuImagesArray = [];
    
    // Add existing images that weren't deleted (sent from frontend)
    if (req.body.existingMenuImages) {
      if (Array.isArray(req.body.existingMenuImages)) {
        menuImagesArray = [...req.body.existingMenuImages];
      } else {
        menuImagesArray = [req.body.existingMenuImages];
      }
    }
    console.log("Existing menu images received from frontend:", req.body.existingMenuImages);
    console.log("Menu images array after adding existing:", menuImagesArray);
    
    // Add new uploads
    if (req.files && req.files.menuimages) {
      const newMenuImages = req.files.menuimages.map(file => `/uploads/menu-images/${file.filename}`);
      menuImagesArray = [...menuImagesArray, ...newMenuImages];
      console.log("New menu images uploaded:", newMenuImages);
    }
    updateFields.menuimages = menuImagesArray;
    console.log("Final menu images array:", menuImagesArray);

    // Handle restaurant images - use existing images sent from frontend, then add new uploads
    let restaurantImagesArray = [];
    
    // Add existing images that weren't deleted (sent from frontend)
    if (req.body.existingRestaurantImages) {
      if (Array.isArray(req.body.existingRestaurantImages)) {
        restaurantImagesArray = [...req.body.existingRestaurantImages];
      } else {
        restaurantImagesArray = [req.body.existingRestaurantImages];
      }
    }
    console.log("Existing restaurant images received from frontend:", req.body.existingRestaurantImages);
    console.log("Restaurant images array after adding existing:", restaurantImagesArray);
    
    // Add new uploads
    if (req.files && req.files.restaurantImages) {
      const newRestaurantImages = req.files.restaurantImages.map(file => `/uploads/restaurant-images/${file.filename}`);
      restaurantImagesArray = [...restaurantImagesArray, ...newRestaurantImages];
      console.log("New restaurant images uploaded:", newRestaurantImages);
    }
    updateFields.restaurantImages = restaurantImagesArray;
    console.log("Final restaurant images array:", restaurantImagesArray);
    
    console.log("Update Fields:", updateFields);

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    console.log("Updated Restaurant:", updatedRestaurant);

    console.log("=== UPDATE INFO HUB SUCCESS ===");
    res.status(200).json({
      message: "Info Hub updated successfully",
      data: updatedRestaurant
    });

  } catch (error) {
    console.error("=== UPDATE INFO HUB ERROR ===");
    console.error("Error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error updating Info Hub", error: error.message });
  }
};


// GET - Get all restaurants (PUBLIC - for users to browse)
exports.getAllRestaurants = async (req, res) => {
  try {
    const { state, city, search } = req.query;
    let query = {};

    // Filter by state if provided
    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    // Filter by city if provided
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Search by restaurant name if provided
    if (search) {
      query.restaurantName = { $regex: search, $options: 'i' };
    }

    const restaurants = await Restaurant.find(query).select('-password');
    
    res.status(200).json({
      message: 'Restaurants fetched successfully',
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    console.error('Get All Restaurants Error:', error);
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  }
};


// GET - Get single restaurant by ID (PUBLIC - for users to view details)
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select('-password');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json({
      message: 'Restaurant fetched successfully',
      restaurant
    });
  } catch (error) {
    console.error('Get Restaurant By ID Error:', error);
    res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
  }
};
