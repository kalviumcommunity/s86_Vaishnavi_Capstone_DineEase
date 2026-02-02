import api, { publicApi } from './Api';

// =================== RESTAURANT AUTHENTICATION SERVICES =================== //

/**
 * Restaurant Signup
 * @param {Object} restaurantData - { name, email, restaurantName, phoneNumber, city, state, password }
 * @returns {Promise} Response with restaurant data and token
 */
export const restaurantSignup = async (restaurantData) => {
  try {
    const response = await api.post('/auth/signup', {
      role: 'restaurant',
      ...restaurantData,
    });
    
    // Store token and restaurant data in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};

/**
 * Restaurant Login
 * @param {Object} credentials - { email, password }
 * @returns {Promise} Response with restaurant data and token
 */
export const restaurantLogin = async (credentials) => {
  try {
    const response = await api.post('/auth/login', {
      role: 'restaurant',
      ...credentials,
    });
    
    // Store token and restaurant data in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

/**
 * Restaurant Logout
 * Clears token and user data from localStorage
 */
export const restaurantLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

/**
 * Restaurant Forgot Password
 * @param {string} email - Restaurant email
 * @param {string} newPassword - New password to set
 * @returns {Promise} Response with success message
 */
export const restaurantForgotPassword = async (email, newPassword) => {
  try {
    const response = await api.post('/auth/forgot-password', {
      email,
      newPassword,
      role: 'restaurant',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update password' };
  }
};

/**
 * Restaurant Reset Password
 * @param {string} token - Reset token from URL
 * @param {string} password - New password
 * @returns {Promise} Response confirmation
 */
export const restaurantResetPassword = async (token, password) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};

// =================== RESTAURANT PROFILE SERVICES =================== //

/**
 * Get Restaurant Profile
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise} Restaurant profile data
 */
export const getRestaurantProfile = async (restaurantId) => {
  try {
    const response = await api.get(`/restaurants/${restaurantId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch restaurant profile' };
  }
};

/**
 * Update Restaurant Profile
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} restaurantData - Updated restaurant data
 * @returns {Promise} Updated restaurant data
 */
export const updateRestaurantProfile = async (restaurantId, restaurantData) => {
  try {
    const response = await api.put(`/restaurants/${restaurantId}`, restaurantData);
    
    // Update localStorage if successful
    if (response.data.data) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

/**
 * Delete Restaurant Account
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteRestaurantAccount = async (restaurantId) => {
  try {
    const response = await api.delete(`/restaurants/${restaurantId}`);
    
    // Clear localStorage after successful deletion
    restaurantLogout();
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete account' };
  }
};

/**
 * Get Restaurant Statistics
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise} Restaurant stats (tables, reservations)
 */
export const getRestaurantStats = async (restaurantId) => {
  try {
    const response = await api.get(`/restaurants/${restaurantId}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch restaurant stats' };
  }
};

/**
 * Update Restaurant Info Hub
 * @param {string} restaurantId - Restaurant ID
 * @param {FormData} infoHubData - FormData with text fields and files
 * @returns {Promise} Updated restaurant data
 */
export const updateInfoHub = async (restaurantId, infoHubData) => {
  try {
    // If infoHubData is FormData, send it directly with multipart/form-data headers
    const isFormData = infoHubData instanceof FormData;
    
    const response = await api.put(`/restaurants/${restaurantId}/info-hub`, infoHubData, {
      headers: isFormData ? {
        'Content-Type': 'multipart/form-data'
      } : {}
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update info hub' };
  }
};

// =================== UTILITY FUNCTIONS =================== //

/**
 * Get Current Restaurant from localStorage
 * @returns {Object|null} Restaurant object or null
 */
export const getCurrentRestaurant = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if restaurant is authenticated
 * @returns {boolean} True if authenticated
 */
export const isRestaurantAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = getCurrentRestaurant();
  return !!token && user?.role === 'restaurant';
};


// =================== PUBLIC RESTAURANT BROWSING SERVICES =================== //

/**
 * Get all restaurants (PUBLIC - for users to browse)
 * @param {Object} filters - { state, city, search }
 * @returns {Promise} Response with array of restaurants
 */
export const getAllRestaurants = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.state) params.append('state', filters.state);
    if (filters.city) params.append('city', filters.city);
    if (filters.search) params.append('search', filters.search);
    
    const response = await publicApi.get(`/restaurants/browse/all?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch restaurants' };
  }
};

/**
 * Get single restaurant by ID (PUBLIC - for users to view details)
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise} Response with restaurant details
 */
export const getRestaurantById = async (restaurantId) => {
  try {
    const response = await publicApi.get(`/restaurants/browse/${restaurantId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch restaurant details' };
  }
};


// =================== DEFAULT EXPORT =================== //

const RestaurantServices = {
  // Auth
  restaurantSignup,
  restaurantLogin,
  restaurantLogout,
  restaurantForgotPassword,
  restaurantResetPassword,
  
  // Profile
  getRestaurantProfile,
  updateRestaurantProfile,
  deleteRestaurantAccount,
  getRestaurantStats,
  updateInfoHub,
  
  // Public Browsing
  getAllRestaurants,
  getRestaurantById,
  
  // Utility
  getCurrentRestaurant,
  isRestaurantAuthenticated,
};

export default RestaurantServices;
