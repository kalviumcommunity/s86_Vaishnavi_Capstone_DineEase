import api from './Api';

// =================== USER AUTHENTICATION SERVICES =================== //

/**
 * User Signup
 * @param {Object} userData - { userName, email, phoneNumber, password }
 * @returns {Promise} Response with user data and token
 */
export const userSignup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', {
      role: 'user',
      ...userData,
    });
    
    
    // Store token and user data in localStorage
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
 * User Login
 * @param {Object} credentials - { email, password }
 * @returns {Promise} Response with user data and token
 */
export const userLogin = async (credentials) => {
  try {
    const response = await api.post('/auth/login', {
      role: 'user',
      ...credentials,
    });
    
    // Store token and user data in localStorage
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
 * User Logout
 * Clears token and user data from localStorage
 */
export const userLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

/**
 * Forgot Password
 * @param {string} email - User email
 * @param {string} newPassword - New password to set
 * @returns {Promise} Response with success message
 */
export const forgotPassword = async (email, newPassword) => {
  try {
    const response = await api.post('/auth/forgot-password', {
      email,
      newPassword,
      role: 'user',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update password' };
  }
};

/**
 * Reset Password
 * @param {string} token - Reset token from URL
 * @param {string} password - New password
 * @returns {Promise} Response confirmation
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};

/**
 * Google Login
 * Redirects to Google OAuth
 */
export const googleLogin = () => {
  window.location.href = 'http://localhost:3000/api/auth/google';
};

/**
 * Get Current User from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Get Token from localStorage
 * @returns {string|null} Token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

// =================== USER PROFILE SERVICES =================== //

/**
 * Get User Profile
 * @returns {Promise} User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

/**
 * Update User Profile
 * @param {Object} userData - Updated user data
 * @returns {Promise} Updated user data
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/user/profile', userData);
    
    // Update localStorage if successful
    if (response.data.data) {
      const currentUser = getCurrentUser();
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

/**
 * Delete User Account
 * @returns {Promise} Deletion confirmation
 */
export const deleteUserAccount = async () => {
  try {
    const response = await api.delete('/user/profile');
    
    // Clear localStorage after successful deletion
    userLogout();
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete account' };
  }
};

// =================== DEFAULT EXPORT =================== //

const UserServices = {
  // Auth
  userSignup,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  googleLogin,
  getCurrentUser,
  getToken,
  isAuthenticated,
  
  // Profile
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
};

export default UserServices;
