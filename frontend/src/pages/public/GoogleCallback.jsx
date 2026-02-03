import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const hasProcessed = useRef(false); // Prevent double processing

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const userParam = urlParams.get('user');
      const error = urlParams.get('error');

      // Create a unique key for this callback attempt
      const callbackKey = `google_callback_${token?.substring(0, 20)}`;
      
      // Check if we've already processed this exact callback
      if (hasProcessed.current || sessionStorage.getItem(callbackKey)) {
        console.log('⏭️ Skipping - already processed this callback');
        return;
      }

      // Mark as processed immediately
      hasProcessed.current = true;
      sessionStorage.setItem(callbackKey, 'processed');

      console.log('🔑 Google Callback - Token:', token ? 'Present' : 'Missing');
      console.log('👤 Google Callback - User:', userParam ? 'Present' : 'Missing');
      console.log('❌ Google Callback - Error:', error);

      if (error) {
        console.error('Google OAuth error:', error);
        sessionStorage.removeItem(callbackKey);
        alert('Google authentication failed. Please try again.');
        navigate('/user/auth', { replace: true });
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          console.log('✅ Parsed user data:', user);
          
          // Store auth data in localStorage FIRST
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('💾 Stored in localStorage successfully');
          
          // Update auth context (this will trigger setToken and setUser)
          login(user, token);
          console.log('🔄 Auth context updated');
          
          console.log('📍 Navigating to dashboard...');
          // Redirect to user dashboard immediately
          navigate('/user/dashboard', { replace: true });
        } catch (error) {
          console.error('Error parsing user data:', error);
          sessionStorage.removeItem(callbackKey);
          alert('Authentication failed. Please try again.');
          navigate('/user/auth', { replace: true });
        }
      } else {
        console.error('Missing token or user data');
        sessionStorage.removeItem(callbackKey);
        alert('Authentication failed. Please try again.');
        navigate('/user/auth', { replace: true });
      }
    };

    handleGoogleCallback();
  }, []); // Empty dependency - only run once on mount

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader />
        <p className="mt-4 text-gray-600">Completing Google authentication...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;