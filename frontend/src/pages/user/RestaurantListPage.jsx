import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getAllRestaurants } from "../../services/RestaurantServices";
import Loader from "../../components/common/Loader";

const RestaurantListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stateParam = searchParams.get("state");
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Check if user is logged in
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    fetchRestaurants();
  }, [stateParam]);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (stateParam) {
        filters.state = stateParam;
      }
      
      const response = await getAllRestaurants(filters);
      setRestaurants(response.restaurants || []);
      
      // Clear error if successful
      if (response.restaurants && response.restaurants.length === 0) {
        // No error, just empty results - will show empty state
        setError("");
      }
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      // Only set error for actual failures, not empty results
      setError(err.message || "Failed to load restaurants. Please try again.");
      setRestaurants([]); // Clear restaurants on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchRestaurants();
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const filters = { search: searchTerm };
      if (stateParam) {
        filters.state = stateParam;
      }
      const response = await getAllRestaurants(filters);
      setRestaurants(response.restaurants || []);
      
      // Clear error if successful
      if (response.restaurants && response.restaurants.length === 0) {
        setError("");
      }
    } catch (err) {
      console.error("Error searching restaurants:", err);
      setError(err.message || "Failed to search restaurants. Please try again.");
      setRestaurants([]); // Clear restaurants on error
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredRestaurants = restaurants;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="w-full text-white shadow-lg sticky top-0 z-50" style={{ backgroundColor: '#2F5249' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to={isLoggedIn ? "/user/dashboard" : "/"} className="text-2xl font-bold hover:scale-105 transition-transform duration-300" style={{ color: '#E8D77D' }}>
              DineEase
            </Link>

            {/* Back Link */}
            <Link
              to={isLoggedIn ? "/user/dashboard" : "/"}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: '#E8D77D', color: '#2F5249' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {isLoggedIn ? "Dashboard" : "Home"}
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {!isLoggedIn && (
              <Link
                to="/user/auth"
                className="px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#E8D77D', color: '#2F5249' }}
              >
                Login / Sign Up
              </Link>
            )}
            
            {/* Profile Icon - Only show if logged in */}
            {isLoggedIn && (
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
                  to="/user/profile"
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
                  👤 Profile
                </Link>
                <Link
                  to="/user/bookings"
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
                  📅 My Bookings
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
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Page Title and Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 mb-12">
          {/* Title Section */}
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#2F5249' }}>
              {stateParam ? `Restaurants in ${stateParam}` : 'All Restaurants'}
            </h1>
            <p className="text-lg text-gray-600">
              Discover amazing dining experiences near you
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3 w-full lg:w-auto lg:min-w-[450px]">
            <input
              type="text"
              placeholder="Search restaurants by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-6 py-3 rounded-full border-2 focus:outline-none focus:ring-2 transition-all duration-300"
              style={{ borderColor: '#97B067' }}
            />
            <button
              onClick={handleSearch}
              className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap"
              style={{ backgroundColor: '#2F5249' }}
            >
              Search
            </button>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  fetchRestaurants();
                }}
                className="px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap"
                style={{ backgroundColor: '#E8D77D', color: '#2F5249' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="inline-block px-8 py-4 bg-red-100 border-2 border-red-400 rounded-xl text-red-700">
              {error}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#2F5249' }}>
              No restaurants found
            </h2>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No restaurants match your search "${searchTerm}"`
                : stateParam 
                  ? `No restaurants available in ${stateParam} yet`
                  : 'No restaurants available yet'}
            </p>
            <Link
              to={isLoggedIn ? "/user/dashboard" : "/"}
              className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#2F5249' }}
            >
              {isLoggedIn ? "Back to Dashboard" : "Back to Home"}
            </Link>
          </div>
        )}

        {/* Restaurant Grid */}
        {!loading && !error && filteredRestaurants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 flex flex-col"
                style={{ borderColor: '#97B067' }}
              >
                {/* Restaurant Image */}
                <div className="h-40 bg-gradient-to-br from-green-100 to-yellow-100 relative overflow-hidden">
                  <div className="flex items-center justify-center h-full text-5xl">
                    🍽️
                  </div>
                </div>

                {/* Restaurant Details */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#2F5249' }}>
                    {restaurant.restaurantName}
                  </h3>
                  
                  <div className="space-y-2 mb-4 text-gray-700 flex-1">
                    <p className="flex items-center gap-2 text-base">
                      <span className="text-xl">📍</span>
                      <span className="font-medium">{restaurant.city}</span>
                    </p>
                    {restaurant.location && (
                      <p className="flex items-center gap-2 text-sm">
                        <span className="text-lg">📌</span>
                        <span>{restaurant.location}</span>
                      </p>
                    )}
                    {restaurant.timings && (
                      <p className="flex items-center gap-2 text-sm">
                        <span className="text-lg">🕒</span>
                        <span>{restaurant.timings}</span>
                      </p>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={isLoggedIn ? `/user/restaurant/${restaurant._id}` : `/restaurant/${restaurant._id}`}
                    className="block w-full text-center px-5 py-2.5 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg text-base"
                    style={{ backgroundColor: '#2F5249' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantListPage;
