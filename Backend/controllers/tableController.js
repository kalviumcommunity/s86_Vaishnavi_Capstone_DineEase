const Table = require('../models/table');

// Add new table
exports.createTable = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { floorNo, tableNo, seatingCapacity, available } = req.body;

    if (!floorNo || !tableNo || !seatingCapacity) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const newTable = new Table({
      adminId,
      floorNo,
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