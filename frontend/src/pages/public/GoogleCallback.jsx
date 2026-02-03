import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const userParam = urlParams.get('user');
      const error = urlParams.get('error');

      console.log('Google Callback - Token:', token ? 'Present' : 'Missing');
      console.log('Google Callback - User:', userParam ? 'Present' : 'Missing');
      console.log('Google Callback - Error:', error);

      if (error) {
        console.error('Google OAuth error:', error);
        alert('Google authentication failed. Please try again.');
        navigate('/user/auth');
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          console.log('Parsed user data:', user);
          
          // Store auth data in localStorage and context
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('Stored in localStorage successfully');
          
          // Update auth context
          if (login) {
            login(user, token);
          }
          
          console.log('Navigating to dashboard...');
          // Redirect to user dashboard
          navigate('/user/dashboard', { replace: true });
        } catch (error) {
          console.error('Error parsing user data:', error);
          alert('Authentication failed. Please try again.');
          navigate('/user/auth');
        }
      } else {
        console.error('Missing token or user data');
        alert('Authentication failed. Please try again.');
        navigate('/user/auth');
      }
    };

    handleGoogleCallback();
  }, [location, navigate, login]);

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