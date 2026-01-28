const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({

  name:{
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength:8
  },
  restaurantName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength:10
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  aboutUs: {
   type: String,
   default: 'Enter your Details',
   required: true,
  },
  timings:{
    type: String,
    required: true,
    default:"9.00 AM to 12.00 PM"
  },
  menuimages: [String],
  restaurantImages: [String]

}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
