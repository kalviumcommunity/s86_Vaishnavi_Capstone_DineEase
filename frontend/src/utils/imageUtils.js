// Image utility functions for handling restaurant images

const BACKEND_URL = 'http://localhost:3000';

/**
 * Get full image URL from relative path
 * @param {string} imagePath - Relative image path from database (e.g., /uploads/menu-images/file.jpg)
 * @returns {string} Full URL to access the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.warn('getImageUrl called with empty imagePath');
    return '';
  }
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('getImageUrl: Cloudinary/external URL detected:', imagePath);
    return imagePath;
  }
  
  // If path starts with /, just prepend backend URL
  if (imagePath.startsWith('/')) {
    const fullUrl = `${BACKEND_URL}${imagePath}`;
    console.log('getImageUrl: Local path with /, converted to:', fullUrl);
    return fullUrl;
  }
  
  // Otherwise, add /uploads/ prefix
  const fullUrl = `${BACKEND_URL}/uploads/${imagePath}`;
  console.log('getImageUrl: Relative path, converted to:', fullUrl);
  return fullUrl;
};

/**
 * Get placeholder image URL
 * @param {string} type - Type of image ('menu' or 'restaurant')
 * @returns {string} Placeholder image URL
 */
export const getPlaceholderImage = (type = 'menu') => {
  const text = type === 'menu' ? 'Menu+Image' : 'Restaurant+Image';
  return `https://via.placeholder.com/400x300?text=${text}+Not+Available`;
};

export default { getImageUrl, getPlaceholderImage };
