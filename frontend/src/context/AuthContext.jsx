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
      console.log('🔄 AuthContext: Initializing auth state...');
      
      // Set a timeout to force loading to false if it takes too long
      const timeoutId = setTimeout(() => {
        console.warn('⚠️ Auth initialization timed out, forcing loading to false');
        setLoading(false);
      }, 2000); // 2 second timeout
      
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        console.log('📦 Stored token:', storedToken ? 'Present' : 'Missing');
        console.log('📦 Stored user:', storedUser ? 'Present' : 'Missing');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          console.log('✅ Auth state initialized successfully', parsedUser);
        } else {
          console.log('ℹ️ No stored auth data found');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        clearTimeout(timeoutId);
        console.log('✅ Setting loading to false');
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
      console.log('AuthContext login called with:', { userData, authToken: authToken ? 'Present' : 'Missing' });
      setToken(authToken);
      setUser(userData);
      setLoading(false); // ✅ Set loading to false after login
      
      // Store in localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('AuthContext login completed successfully');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false); // ✅ Set loading to false even on error
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
      {console.log('🔍 AuthContext render - loading:', loading, 'user:', user ? 'Present' : 'None')}
      {!loading ? children : <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing auth...</p>
        </div>
      </div>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
