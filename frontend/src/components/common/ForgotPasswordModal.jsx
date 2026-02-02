import { useState } from 'react';
import UserServices from '../../services/UserServices';
import RestaurantServices from '../../services/RestaurantServices';

const ForgotPasswordModal = ({ isOpen, onClose, userType = 'user' }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      let response;
      if (userType === 'restaurant') {
        response = await RestaurantServices.restaurantForgotPassword(email, newPassword);
      } else {
        response = await UserServices.forgotPassword(email, newPassword);
      }
      
      setMessage('Password updated successfully! You can now login with your new password.');
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Auto-close modal after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: '#437057' }}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          style={{ color: '#97B067' }}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#437057' }}>
          Reset Password
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          Enter your email and new password to reset your account password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-semibold mb-2" style={{ color: '#437057' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border-2 rounded-2xl px-4 py-3 text-lg transition-all duration-300 focus:outline-none focus:shadow-lg"
              style={{ borderColor: '#97B067' }}
              onFocus={(e) => {
                e.target.style.borderColor = '#437057';
                e.target.style.transform = 'scale(1.01)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#97B067';
                e.target.style.transform = 'scale(1)';
              }}
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block font-semibold mb-2" style={{ color: '#437057' }}>
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border-2 rounded-2xl px-4 py-3 pr-12 text-lg transition-all duration-300 focus:outline-none focus:shadow-lg"
                style={{ borderColor: '#97B067' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#437057';
                  e.target.style.transform = 'scale(1.01)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#97B067';
                  e.target.style.transform = 'scale(1)';
                }}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-sm font-semibold transition-colors hover:scale-110 duration-200"
                style={{ color: '#437057' }}
                onMouseEnter={(e) => e.target.style.color = '#97B067'}
                onMouseLeave={(e) => e.target.style.color = '#437057'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block font-semibold mb-2" style={{ color: '#437057' }}>
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border-2 rounded-2xl px-4 py-3 text-lg transition-all duration-300 focus:outline-none focus:shadow-lg"
              style={{ borderColor: '#97B067' }}
              onFocus={(e) => {
                e.target.style.borderColor = '#437057';
                e.target.style.transform = 'scale(1.01)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#97B067';
                e.target.style.transform = 'scale(1)';
              }}
              required
              minLength={6}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Success message */}
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-green-600 text-sm">{message}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white text-lg font-semibold py-3 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ backgroundColor: '#437057' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2F5249')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#437057')}
          >
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>

        {/* Back to login */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-600 hover:underline transition-colors"
            style={{ color: '#97B067' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;