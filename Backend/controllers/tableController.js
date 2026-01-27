const Table = require('../models/table');

// Add new table
exports.createTable = async (req, res) => {
  try {
    const restaurantId = req.user.id; // ✅ logged in restaurant ID
    const { floor, tableNo, seatingCapacity, available } = req.body;

    if (!floor || !tableNo || !seatingCapacity) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const newTable = new Table({
      RestaurantId: restaurantId, // ✅ correct field name
      floor,
      tableNo,
      seatingCapacity,
      available
    });

    await newTable.save();
    res.status(201).json({ message: 'Table created successfully', data: newTable });

  } catch (error) {
    console.error('Create Table Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all tables for restaurant
exports.getTables = async (req, res) => {
  try {
    const restaurantId = req.user.id; // ✅ logged in restaurant ID
    const tables = await Table.find({ RestaurantId: restaurantId });

    res.status(200).json({ tables });
  } catch (error) {
    console.error('Get Tables Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Edit a table
exports.updateTable = async (req, res) => {
  try {
    const tableId = req.params.id;
    const updates = req.body;

    const updatedTable = await Table.findByIdAndUpdate(tableId, updates, { new: true });
    res.status(200).json({ message: 'Table updated successfully', data: updatedTable });
  } catch (error) {
    console.error('Update Table Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
  try {
    const tableId = req.params.id;

    await Table.findByIdAndDelete(tableId);
    res.status(200).json({ message: 'Table deleted successfully' });

  } catch (error) {
    console.error('Delete Table Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get tables by restaurant ID (PUBLIC - for users to see available tables)
exports.getTablesByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const tables = await Table.find({ RestaurantId: restaurantId });

    res.status(200).json({ 
      message: 'Tables fetched successfully',
      count: tables.length,
      tables 
    });
  } catch (error) {
    console.error('Get Tables By Restaurant Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
