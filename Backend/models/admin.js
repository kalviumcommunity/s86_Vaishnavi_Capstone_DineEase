const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    minlength:10
  },
  location: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength:8
  }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
