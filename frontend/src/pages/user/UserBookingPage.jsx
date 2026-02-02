import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getMyBookings, deleteBooking } from "../../services/BookingServices";

const UserBookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "present");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    // Don't show loading spinner for background updates
    if (bookings.length === 0) {
      setLoading(true);
    }
    setError("");
    try {
      const response = await getMyBookings();
      setBookings(response.bookings || response || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await deleteBooking(bookingId);
      alert("Booking cancelled successfully!");
      fetchBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings
    .filter((booking) => {
      // Combine date and time to get the actual booking datetime
      const bookingDateTime = new Date(booking.date);
      const [hours, minutes] = booking.time.split(':');
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const now = new Date();
      const twentyFourHoursAfterBooking = new Date(bookingDateTime.getTime() + (24 * 60 * 60 * 1000));
      const isPast24Hours = now > twentyFourHoursAfterBooking;
      
      if (activeTab === "present") {
        // Present: Bookings that haven't passed 24 hours after their scheduled time
        return !isPast24Hours;
      } else {
        // Previous: Bookings that are more than 24 hours past their scheduled time
        return isPast24Hours;
      }
    })
    .sort((a, b) => {
      // Sort by createdAt in descending order (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 via-yellow-50 to-green-50">
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
                <Link
                  to="/user/profile"
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
                  My Profile
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
              <span>←</span> Back
            </button>

            <button
              onClick={() => navigate("/user/profile")}
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
              Your Account
            </button>

            <button
              onClick={() => setActiveTab("previous")}
              className={`w-full text-left px-6 py-3 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border-2 font-semibold ${
                activeTab === "previous" ? "scale-105" : ""
              }`}
              style={{
                backgroundColor: activeTab === "previous" ? '#437057' : 'white',
                borderColor: activeTab === "previous" ? '#2F5249' : '#97B067',
                color: activeTab === "previous" ? '#E8D77D' : '#437057'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "previous") {
                  e.currentTarget.style.backgroundColor = '#E8D77D20';
                  e.currentTarget.style.borderColor = '#437057';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "previous") {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#97B067';
                }
              }}
            >
              Previous Bookings
            </button>

            <button
              onClick={() => setActiveTab("present")}
              className={`w-full text-left px-6 py-3 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border-2 font-semibold ${
                activeTab === "present" ? "scale-105" : ""
              }`}
              style={{
                backgroundColor: activeTab === "present" ? '#437057' : 'white',
                borderColor: activeTab === "present" ? '#2F5249' : '#97B067',
                color: activeTab === "present" ? '#E8D77D' : '#437057'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "present") {
                  e.currentTarget.style.backgroundColor = '#E8D77D20';
                  e.currentTarget.style.borderColor = '#437057';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "present") {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#97B067';
                }
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

          {/* Main Content */}
          <main className="bg-white rounded-2xl shadow-2xl p-10 border-2 hover:shadow-[0_35px_60px_-15px_rgba(67,112,87,0.3)] transition-all duration-500" style={{ borderColor: '#97B067' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-12 rounded-full" style={{ backgroundColor: '#437057' }}></div>
              <h1 className="text-4xl font-bold" style={{ color: '#2F5249' }}>
                {activeTab === "present" ? "Your Present Bookings" : "Your Past Bookings"}
              </h1>
            </div>

            {activeTab === "present" && (
              <div className="mb-6 p-3 rounded-lg border-2 border-blue-400 bg-blue-50 text-center">
                <p className="text-sm font-medium text-blue-700">
                  💡 Refresh the page after a few minutes to check your booking status
                </p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#97B067', borderTopColor: 'transparent' }}></div>
                <p className="mt-4 text-gray-600">Loading bookings...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl">
                {error}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8D77D30' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12"
                    style={{ color: '#437057' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#2F5249' }}>
                  No bookings found
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  {activeTab === "present"
                    ? "You don't have any upcoming bookings."
                    : "You don't have any past bookings."}
                </p>
                <Link
                  to="/user/dashboard"
                  className="inline-block px-8 py-4 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
                  style={{ backgroundColor: '#437057' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2F5249'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#437057'}
                >
                  Browse Restaurants
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border rounded-xl p-6 transition-all duration-300 hover:shadow-xl bg-white"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    {/* Restaurant Header */}
                    <div className="mb-4 pb-4 border-b" style={{ borderColor: '#E5E7EB' }}>
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#437057' }}>
                        {booking.restaurantId?.restaurantName || "Restaurant"}
                      </h3>
                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                        <span className="text-base">📍</span>
                        <span className="flex-1">{booking.restaurantId?.location || booking.restaurantId?.city || "N/A"}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Name:</span>
                          <span className="text-base font-medium text-gray-900">{booking.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Phone:</span>
                          <span className="text-base font-medium text-gray-900">{booking.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Booking Details - Single Row */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {new Date(booking.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⏰</span>
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="text-sm font-semibold text-gray-800">{booking.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👥</span>
                        <div>
                          <p className="text-xs text-gray-500">Guests</p>
                          <p className="text-sm font-semibold text-gray-800">{booking.totalPeople}</p>
                        </div>
                      </div>
                    </div>

                    {/* Special Request */}
                    {booking.specialRequest && (
                      <div className="mb-4 p-3 rounded-lg bg-gray-50 border" style={{ borderColor: '#E5E7EB' }}>
                        <div className="flex items-start gap-2">
                          <span className="text-base">💬</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Special Request</p>
                            <p className="text-sm text-gray-700">{booking.specialRequest}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Booking Status Message */}
                    {booking.status === "pending" && (
                      <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-800 text-center">
                          ⏳ Awaiting confirmation from restaurant
                        </p>
                      </div>
                    )}
                    {booking.status === "confirmed" && (
                      <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-sm font-medium text-green-800 text-center">
                          ✅ Booking Confirmed by Restaurant
                        </p>
                      </div>
                    )}
                    {booking.status === "cancelled" && (
                      <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm font-medium text-red-800 text-center">
                          {booking.cancellationSource === 'user'
                            ? '✕ Booking Cancelled by You'
                            : '✕ Booking Cancelled by Restaurant'}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        className="flex-1 py-2.5 text-white text-sm font-medium rounded-lg transition-all hover:opacity-90"
                        onClick={() => navigate(`/user/restaurant/${booking.restaurantId?._id}`)}
                        style={{ backgroundColor: '#437057' }}
                      >
                        View Restaurant
                      </button>
                      
                      {activeTab === "previous" ? (
                        <button
                          className="flex-1 py-2.5 text-white text-sm font-medium rounded-lg transition-all hover:opacity-90"
                          onClick={() => navigate(`/user/restaurant/${booking.restaurantId?._id}`)}
                          style={{ backgroundColor: '#97B067' }}
                        >
                          Rebook
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={booking.status === "cancelled"}
                          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                            booking.status === "cancelled" 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {booking.status === "cancelled" ? "Cancelled" : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserBookingPage;
