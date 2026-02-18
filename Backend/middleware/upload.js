const multer = require('multer');
const path = require('path');
const { menuImagesStorage, restaurantImagesStorage } = require('../config/cloudinary');

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
  }
};

// Create multer instances for Cloudinary storage
const uploadMenuImages = multer({
  storage: menuImagesStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
}).array('menuimages', 10); // Max 10 menu images

const uploadRestaurantImages = multer({
  storage: restaurantImagesStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
}).array('restaurantImages', 10); // Max 10 restaurant images

// Custom middleware to handle both types with Cloudinary
const uploadBothImages = (req, res, next) => {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  const { cloudinary } = require('../config/cloudinary');

  // Create separate storage for menu images
  const menuStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'dineease/menu-images',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    },
  });

  // Create separate storage for restaurant images
  const restaurantStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'dineease/restaurant-images',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }],
    },
  });

  // Custom storage that routes to different Cloudinary folders based on field name
  const dynamicStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      if (file.fieldname === 'menuimages') {
        return {
          folder: 'dineease/menu-images',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
        };
      } else if (file.fieldname === 'restaurantImages') {
        return {
          folder: 'dineease/restaurant-images',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          transformation: [{ width: 1200, height: 800, crop: 'limit' }],
        };
      }
      return {
        folder: 'dineease/uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      };
    },
  });

  const upload = multer({
    storage: dynamicStorage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit per file
    }
  }).fields([
    { name: 'menuimages', maxCount: 10 },
    { name: 'restaurantImages', maxCount: 10 }
  ]);

  upload(req, res, (err) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(400).json({ 
        message: 'File upload failed', 
        error: err.message 
      });
    }
    next();
  });
};

module.exports = {
  uploadMenuImages,
  uploadRestaurantImages,
  uploadBothImages
};
