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

      if (error) {
        console.error('Google OAuth error:', error);
        alert('Google authentication failed. Please try again.');
        navigate('/auth/user');
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          
          // Store auth data in localStorage and context
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Update auth context
          login(user, token);
          
          // Redirect to user dashboard
          navigate('/user/dashboard', { replace: true });
        } catch (error) {
          console.error('Error parsing user data:', error);
          alert('Authentication failed. Please try again.');
          navigate('/auth/user');
        }
      } else {
        console.error('Missing token or user data');
        alert('Authentication failed. Please try again.');
        navigate('/auth/user');
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