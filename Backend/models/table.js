const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  floorNo: {
    type: Number,
    required: true
  },
  tableNo: {
    type: Number,
    required: true
  },
  seatingCapacity: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
