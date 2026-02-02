import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserServices from '../services/UserServices';
import RestaurantServices from '../services/RestaurantServices';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // =================== USER AUTH METHODS =================== //

  /**
   * User Signup
   */
  const userSignup = async (userData) => {
    try {
      const response = await UserServices.userSignup(userData);
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        return response;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * User Login
   */
  const userLogin = async (credentials) => {
    try {
      const response = await UserServices.userLogin(credentials);
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        navigate('/user/dashboard');
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * User Logout
   */
  const userLogout = () => {
    setToken(null);
    setUser(null);
    UserServices.userLogout();
  };

  // =================== RESTAURANT AUTH METHODS =================== //

  /**
   * Restaurant Signup
   */
  const restaurantSignup = async (restaurantData) => {
    try {
      const response = await RestaurantServices.restaurantSignup(restaurantData);
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        return response;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Restaurant Login
   */
  const restaurantLogin = async (credentials) => {
    try {
      const response = await RestaurantServices.restaurantLogin(credentials);
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        navigate('/restaurant/dashboard');
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Restaurant Logout
   */
  const restaurantLogout = () => {
    setToken(null);
    setUser(null);
    RestaurantServices.restaurantLogout();
  };

  // =================== SHARED AUTH METHODS =================== //

  /**
   * Generic login method for OAuth callbacks
   */
  const login = (userData, authToken) => {
    try {
      setToken(authToken);
      setUser(userData);
      
      // Store in localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * Generic Logout (handles both user and restaurant)
   */
  const logout = () => {
    if (user?.role === 'restaurant') {
      restaurantLogout();
    } else {
      userLogout();
    }
  };

  /**
   * Check if authenticated
   */
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  /**
   * Check if user role
   */
  const isUser = () => {
    return user?.role === 'user';
  };

  /**
   * Check if restaurant role
   */
  const isRestaurant = () => {
    return user?.role === 'restaurant';
  };

  /**
   * Update user profile in context
   */
  const updateUserContext = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // =================== CONTEXT VALUE =================== //

  const value = {
    // State
    user,
    token,
    loading,
    
    // User Auth
    userSignup,
    userLogin,
    userLogout,
    
    // Restaurant Auth
    restaurantSignup,
    restaurantLogin,
    restaurantLogout,
    
    // Shared Auth
    login,
    logout,
    isAuthenticated,
    isUser,
    isRestaurant,
    
    // Utility
    updateUserContext,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
