const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const menuImagesDir = path.join(uploadsDir, 'menu-images');
const restaurantImagesDir = path.join(uploadsDir, 'restaurant-images');

[uploadsDir, menuImagesDir, restaurantImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for menu images
const menuStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, menuImagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'menu-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for restaurant images
const restaurantStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, restaurantImagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'restaurant-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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

// Create multer instances
const uploadMenuImages = multer({
  storage: menuStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
}).array('menuimages', 10); // Max 10 menu images

const uploadRestaurantImages = multer({
  storage: restaurantStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
}).array('restaurantImages', 10); // Max 10 restaurant images

// Combined upload for both types
const uploadBothImages = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'menuimages') {
        cb(null, menuImagesDir);
      } else if (file.fieldname === 'restaurantImages') {
        cb(null, restaurantImagesDir);
      } else {
        cb(new Error('Invalid field name'));
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const prefix = file.fieldname === 'menuimages' ? 'menu-' : 'restaurant-';
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
}).fields([
  { name: 'menuimages', maxCount: 10 },
  { name: 'restaurantImages', maxCount: 10 }
]);

module.exports = {
  uploadMenuImages,
  uploadRestaurantImages,
  uploadBothImages
};
