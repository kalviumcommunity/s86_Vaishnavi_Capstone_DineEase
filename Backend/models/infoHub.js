const mongoose = require('mongoose');

const infoHubSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
    unique: true
  },
  aboutUs: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  timings: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  menuImages: [String], 
  restaurantImages: [String] 
}, {
  timestamps: true
});

module.exports = mongoose.model('InfoHub', infoHubSchema);
