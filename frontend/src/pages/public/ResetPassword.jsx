import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserServices from '../../services/UserServices';
import RestaurantServices from '../../services/RestaurantServices';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const ResetPassword = () => {
  const { token, userType } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/user/auth');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (userType === 'restaurant') {
        await RestaurantServices.restaurantResetPassword(token, password);
      } else {
        await UserServices.resetPassword(token, password);
      }
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(userType === 'restaurant' ? '/restaurant/auth' : '/user/auth');
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <Navbar simple />
      
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8">
          {success ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#437057' }}>
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your password has been updated successfully. You will be redirected to the login page.
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#437057' }}></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold" style={{ color: '#437057' }}>
                  Reset Password
                </h2>
                <p className="text-gray-600 mt-2">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block font-semibold mb-2" style={{ color: '#437057' }}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white text-lg font-semibold py-3 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  style={{ backgroundColor: '#437057' }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2F5249')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#437057')}
                >
                  <span className="relative z-10">
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </span>
                  {!loading && (
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#97B067' }}></span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;