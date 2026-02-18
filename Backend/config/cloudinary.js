const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for menu images
const menuImagesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dineease/menu-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

// Storage configuration for restaurant images
const restaurantImagesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dineease/restaurant-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

module.exports = {
  cloudinary,
  menuImagesStorage,
  restaurantImagesStorage,
};
