import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  getRestaurantProfile, 
  updateRestaurantProfile, 
  deleteRestaurantAccount,
  getCurrentRestaurant 
} from "../../services/RestaurantServices";
import Loader from "../../components/common/Loader";

const RestaurantProfile = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentRestaurant();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    restaurantName: "",
    phoneNumber: "",
    city: "",
    state: "",
    location: ""
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      setMessage("Please login to access this page");
      setMessageType("error");
      setTimeout(() => navigate("/restaurant/auth"), 2000);
      return;
    }
    
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setMessage(""); // Clear any previous messages
    setMessageType("");
    try {
      const data = await getRestaurantProfile(currentUser.id);
      console.log("Profile data fetched:", data);
      const profileData = {
        name: data.name || "",
        email: data.email || "",
        restaurantName: data.restaurantName || "",
        phoneNumber: data.phoneNumber || "",
        city: data.city || "",
        state: data.state || "",
        location: data.location || ""
      };
      setFormData(profileData);
      setOriginalData(profileData);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setMessage(err.message || "Failed to load profile");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    console.log("Edit clicked - clearing message");
    setIsEditMode(true);
    setMessage("");
    setMessageType("");
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setFormData(originalData);
    setMessage("");
    setMessageType("");
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    
    console.log("Save button clicked");
    
    // Validation
    if (!formData.name || !formData.restaurantName || !formData.phoneNumber || !formData.city || !formData.state) {
      setMessage("Please fill in all required fields");
      setMessageType("error");
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      setMessage("Phone number must be 10 digits");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    
    try {
      console.log("Calling update API with:", formData);
      await updateRestaurantProfile(currentUser.id, formData);
      setOriginalData(formData);
      setIsEditMode(false);
      setMessage("Profile updated successfully!");
      setMessageType("success");
      console.log("Profile updated successfully");
      
      // Update localStorage
      const updatedUser = { ...currentUser, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage(err.message || "Failed to update profile");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteRestaurantAccount(currentUser.id);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Account deleted successfully");
      navigate("/");
    } catch (err) {
      console.error("Error deleting account:", err);
      setMessage(err.message || "Failed to delete account");
      setMessageType("error");
      setShowDeleteConfirm(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-yellow-50 to-green-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="w-full text-white shadow-lg sticky top-0 z-50" style={{ backgroundColor: '#2F5249' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/restaurant/dashboard" className="text-2xl font-bold hover:scale-105 transition-transform duration-300" style={{ color: '#E8D77D' }}>
            DineEase
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/restaurant/dashboard"
              className="px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all"
            >
              Admin Dashboard
            </Link>

            {/* Profile Icon */}
            <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              style={{ backgroundColor: '#E8D77D', color: '#2F5249' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-2xl py-2 z-50 border-2 animate-fade-in" style={{ borderColor: '#97B067' }}>
                <Link
                  to="/restaurant/dashboard"
                  className="block px-4 py-2 transition-all duration-300 rounded-lg mx-2 hover:scale-105"
                  style={{ color: '#2F5249' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#97B067';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#2F5249';
                  }}
                >
                  🏠 Dashboard
                </Link>
                <Link
                  to="/restaurant/info-hub"
                  className="block px-4 py-2 transition-all duration-300 rounded-lg mx-2 hover:scale-105"
                  style={{ color: '#2F5249' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#97B067';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#2F5249';
                  }}
                >
                  ℹ️ Info Hub
                </Link>
                <Link
                  to="/restaurant/tables"
                  className="block px-4 py-2 transition-all duration-300 rounded-lg mx-2 hover:scale-105"
                  style={{ color: '#2F5249' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#97B067';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#2F5249';
                  }}
                >
                  🪑 Tables
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 transition-all duration-300 rounded-lg mx-2 hover:scale-105"
                  style={{ color: '#2F5249' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#E8D77D';
                    e.target.style.color = '#2F5249';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#2F5249';
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2F5249' }}>
            Restaurant Profile
          </h1>
          <p className="text-lg text-gray-600">
            Manage your restaurant account information
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-semibold ${
            messageType === "success" 
              ? "bg-green-100 text-green-700 border-2 border-green-400" 
              : "bg-red-100 text-red-700 border-2 border-red-400"
          }`}>
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4" style={{ borderColor: '#97B067' }}>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Owner Name */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#2F5249' }}>
                  Owner Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
                    isEditMode 
                      ? 'focus:outline-none focus:ring-2 bg-white' 
                      : 'bg-gray-100 cursor-not-allowed'
                  }`}
                  style={{ borderColor: '#97B067' }}
                  placeholder="Enter owner name"
                />
              </div>

              {/* Restaurant Name */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#2F5249' }}>
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
                    isEditMode 
                      ? 'focus:outline-none focus:ring-2 bg-white' 
                      : 'bg-gray-100 cursor-not-allowed'
                  }`}
                  style={{ borderColor: '#97B067' }}
                  placeholder="Enter restaurant name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#2F5249' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border-2 rounded-lg bg-gray-100 cursor-not-allowed"
                  style={{ borderColor: '#97B067' }}
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#2F5249' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
                    isEditMode 
                      ? 'focus:outline-none focus:ring-2 bg-white' 
                      : 'bg-gray-100 cursor-not-allowed'
                  }`}
                  style={{ borderColor: '#97B067' }}
                  placeholder="10-digit phone number"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#2F5249' }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
                    isEditMode 
                      ? 'focus:outline-none focus:ring-2 bg-white' 
                      : 'bg-gray-100 cursor-not-allowed'
                  }`}
                  style={{ borderColor: '#97B067' }}
                  placeholder="Enter city"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#2F5249' }}>
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
                    isEditMode 
                      ? 'focus:outline-none focus:ring-2 bg-white' 
                      : 'bg-gray-100 cursor-not-allowed'
                  }`}
                  style={{ borderColor: '#97B067' }}
                  placeholder="Enter state"
                />
              </div>

              {/* Full Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2" style={{ color: '#2F5249' }}>
                  Full Address
                </label>
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  rows="3"
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all resize-none ${
                    isEditMode 
                      ? 'focus:outline-none focus:ring-2 bg-white' 
                      : 'bg-gray-100 cursor-not-allowed'
                  }`}
                  style={{ borderColor: '#97B067' }}
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </form>

          {/* Action Buttons - Outside Form */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {!isEditMode ? (
              <>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="px-8 py-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#2F5249' }}
                >
                  ✏️ Edit Profile
                </button>
                <Link
                  to="/restaurant/dashboard"
                  className="px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#97B067', color: 'white' }}
                >
                  ← Back to Dashboard
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#2F5249' }}
                >
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: '#E8D77D', color: '#2F5249' }}
                >
                  ❌ Cancel
                </button>
              </>
            )}
          </div>

          {/* Delete Account Section */}
          {!isEditMode && (
            <div className="mt-12 pt-8 border-t-2 border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-red-600">
                Danger Zone
              </h3>
              <p className="text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-3 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  🗑️ Delete Account
                </button>
              ) : (
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
                  <p className="font-bold text-red-700 mb-4">
                    Are you absolutely sure? This action cannot be undone!
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-2 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 transition-all duration-300"
                    >
                      Yes, Delete Forever
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 py-2 rounded-full font-bold bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;
