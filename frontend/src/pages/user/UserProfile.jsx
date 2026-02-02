import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateUserProfile, deleteUserAccount } from "../../services/UserServices";

const UserProfile = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("account");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);

  useEffect(() => {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("User data from localStorage:", userData);
    
    const nameParts = (userData.userName || userData.name || "").split(" ");
    
    const initialData = {
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: userData.email || "",
      phoneNo: userData.phoneNumber || userData.phone || "",
    };
    
    setFormData(initialData);
    setOriginalFormData(initialData);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage("");

    try {
      // Prepare data for API call
      const updateData = {
        userName: `${formData.firstName} ${formData.lastName}`.trim(),
        phoneNumber: formData.phoneNo,
      };

      // Call API to update user profile
      const response = await updateUserProfile(updateData);
      
      // The updateUserProfile service already updates localStorage
      // Just update the form state
      setMessage("Changes saved successfully!");
      setOriginalFormData(formData);
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Update error:", error);
      setMessage(error.message || "Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(originalFormData);
    setIsEditing(false);
    setMessage("");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        setLoading(true);
        await deleteUserAccount();
        // The deleteUserAccount function already handles logout and clearing localStorage
        navigate("/");
      } catch (error) {
        console.error("Delete error:", error);
        setMessage(error.message || "Failed to delete account. Please try again.");
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="w-full text-white shadow-lg" style={{ backgroundColor: '#2F5249' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/user/dashboard" className="text-2xl font-bold hover:scale-105 transition-transform duration-300" style={{ color: '#E8D77D' }}>
            DineEase.com
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
                  to="/user/dashboard"
                  className="block px-4 py-2 transition-all duration-300 rounded-lg mx-2 hover:scale-105"
                  onClick={() => setShowProfileMenu(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E8D77D40';
                    e.currentTarget.style.color = '#437057';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '';
                  }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 transition-all duration-300 rounded-lg mx-2 text-red-600 hover:scale-105"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffebee'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-3">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="w-full text-left px-6 py-3 bg-white rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border-2 flex items-center gap-2 font-medium"
              style={{ borderColor: '#97B067', color: '#437057' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E8D77D20';
                e.currentTarget.style.borderColor = '#437057';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#97B067';
              }}
            >
              <span>←</span> Home
            </button>

            <button
              onClick={() => setActiveSection("account")}
              className={`w-full text-left px-6 py-3 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border-2 font-semibold ${
                activeSection === "account"
                  ? "scale-105"
                  : ""
              }`}
              style={{
                backgroundColor: activeSection === "account" ? '#437057' : 'white',
                borderColor: activeSection === "account" ? '#2F5249' : '#97B067',
                color: activeSection === "account" ? '#E8D77D' : '#437057'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== "account") {
                  e.currentTarget.style.backgroundColor = '#E8D77D20';
                  e.currentTarget.style.borderColor = '#437057';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== "account") {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#97B067';
                }
              }}
            >
              Your Account
            </button>

            <button
              onClick={() => navigate("/user/bookings?tab=previous")}
              className="w-full text-left px-6 py-3 bg-white rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border-2 font-medium"
              style={{ borderColor: '#97B067', color: '#437057' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E8D77D20';
                e.currentTarget.style.borderColor = '#437057';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#97B067';
              }}
            >
              Previous Bookings
            </button>

            <button
              onClick={() => navigate("/user/bookings?tab=present")}
              className="w-full text-left px-6 py-3 bg-white rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border-2 font-medium"
              style={{ borderColor: '#97B067', color: '#437057' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E8D77D20';
                e.currentTarget.style.borderColor = '#437057';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#97B067';
              }}
            >
              Present Bookings
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-6 py-3 bg-white rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border-2 text-red-600 font-medium"
              style={{ borderColor: '#97B067' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffebee';
                e.currentTarget.style.borderColor = '#ef5350';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#97B067';
              }}
            >
              Log out
            </button>
          </aside>

          {/* Main Form */}
          <main className="bg-white rounded-2xl shadow-2xl p-10 border-2 hover:shadow-[0_35px_60px_-15px_rgba(67,112,87,0.3)] transition-all duration-500" style={{ borderColor: '#97B067' }}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-12 rounded-full" style={{ backgroundColor: '#437057' }}></div>
                <h1 className="text-4xl font-bold" style={{ color: '#2F5249' }}>Your Account</h1>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="px-6 py-3 font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center gap-2"
                  style={{ backgroundColor: '#437057', color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2F5249'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#437057'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="px-6 py-3 font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderColor: '#97B067', color: '#437057', backgroundColor: 'white' }}
                    onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'white')}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={loading}
                    className="px-6 py-3 font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#437057', color: 'white' }}
                    onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2F5249')}
                    onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#437057')}
                  >
                    {loading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {message && (
              <div className={`mb-6 px-4 py-3 rounded-xl border-l-4 animate-fade-in ${
                message.includes("success") 
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-red-50 border-red-500 text-red-700"
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSaveChanges} className="space-y-6">
              <div className="group">
                <label htmlFor="firstName" className="block mb-2 font-semibold" style={{ color: '#437057' }}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: '#97B067',
                    backgroundColor: isEditing ? 'white' : '#f5f5f5'
                  }}
                  onFocus={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = '#437057';
                      e.target.style.backgroundColor = '#E8D77D10';
                    }
                  }}
                  onBlur={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = '#97B067';
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                  required
                />
              </div>

              <div className="group">
                <label htmlFor="lastName" className="block mb-2 font-semibold" style={{ color: '#437057' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: '#97B067',
                    backgroundColor: isEditing ? 'white' : '#f5f5f5'
                  }}
                  onFocus={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = '#437057';
                      e.target.style.backgroundColor = '#E8D77D10';
                    }
                  }}
                  onBlur={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = '#97B067';
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                />
              </div>

              <div className="group">
                <label htmlFor="email" className="block mb-2 font-semibold" style={{ color: '#437057' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none transition-all duration-300 disabled:cursor-not-allowed"
                  style={{ borderColor: '#97B067', backgroundColor: '#f5f5f5' }}
                  disabled
                />
              </div>

              <div className="group">
                <label htmlFor="phoneNo" className="block mb-2 font-semibold" style={{ color: '#437057' }}>
                  Phone No
                </label>
                <input
                  type="tel"
                  id="phoneNo"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: '#97B067',
                    backgroundColor: isEditing ? 'white' : '#f5f5f5'
                  }}
                  onFocus={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = '#437057';
                      e.target.style.backgroundColor = '#E8D77D10';
                    }
                  }}
                  onBlur={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = '#97B067';
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                />
              </div>

              <div className="flex justify-between items-center pt-6">
                <div></div>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="font-semibold transition-all duration-300 hover:scale-110"
                  style={{ color: '#2F5249' }}
                  onMouseEnter={(e) => e.target.style.color = '#ef5350'}
                  onMouseLeave={(e) => e.target.style.color = '#2F5249'}
                >
                  Delete my account
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
