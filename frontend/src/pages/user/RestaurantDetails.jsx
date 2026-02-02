import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getRestaurantById } from "../../services/RestaurantServices";
import { createBooking } from "../../services/BookingServices";
import { getTablesByRestaurant } from "../../services/TableServices";
import Loader from "../../components/common/Loader";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageUtils";

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuCarouselIndex, setMenuCarouselIndex] = useState(0);
  const [restaurantCarouselIndex, setRestaurantCarouselIndex] = useState(0);
  
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  
  // Booking form state
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    totalPeople: 2,
    specialRequest: ""
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    fetchRestaurantDetails();
    fetchTables();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getRestaurantById(id);
      console.log('Restaurant data received:', response.restaurant);
      console.log('Menu images:', response.restaurant?.menuimages);
      console.log('Restaurant images:', response.restaurant?.restaurantImages);
      setRestaurant(response.restaurant);
    } catch (err) {
      console.error("Error fetching restaurant:", err);
      setError("Failed to load restaurant details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await getTablesByRestaurant(id);
      setTables(response.tables || []);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMessage("");

    // Validation
    if (!bookingData.name || !bookingData.phone || !bookingData.date || !bookingData.time) {
      setBookingMessage("Please fill in all required fields");
      setBookingLoading(false);
      return;
    }

    // Check if date is in the future
    const selectedDate = new Date(bookingData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setBookingMessage("Please select a future date");
      setBookingLoading(false);
      return;
    }

    try {
      const bookingPayload = {
        ...bookingData,
        restaurantId: id,
        totalPeople: parseInt(bookingData.totalPeople)
      };

      const response = await createBooking(bookingPayload);
      setBookingMessage("Booking created successfully! Redirecting...");
      
      // Reset form
      setBookingData({
        name: "",
        phone: "",
        date: "",
        time: "",
        totalPeople: 2,
        specialRequest: ""
      });

      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        navigate("/user/bookings");
      }, 2000);

    } catch (err) {
      console.error("Error creating booking:", err);
      setBookingMessage(err.message || "Failed to create booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getAvailableTableCount = () => {
    return tables.filter(table => table.available).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-yellow-50 to-green-50">
        <Loader />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-yellow-50 to-green-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#2F5249' }}>
            {error || "Restaurant not found"}
          </h2>
          <Link
            to="/user/dashboard"
            className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#2F5249' }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="w-full text-white shadow-lg sticky top-0 z-50" style={{ backgroundColor: '#2F5249' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/user/dashboard" className="text-2xl font-bold hover:scale-105 transition-transform duration-300" style={{ color: '#E8D77D' }}>
              DineEase
            </Link>

            {/* Back to Browsing Link */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: '#E8D77D', color: '#2F5249' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Browsing
            </button>
          </div>

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
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Restaurant Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold" style={{ color: '#2F5249' }}>
            {restaurant.restaurantName}
          </h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Restaurant Info */}
          <div className="lg:col-span-3 space-y-8">
            {/* About Us */}
            {restaurant.aboutUs && restaurant.aboutUs !== 'Enter your Details' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2" style={{ borderColor: '#97B067' }}>
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#2F5249' }}>
                  About Us
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {restaurant.aboutUs}
                </p>
              </div>
            )}

            {/* Menu Images */}
            {restaurant.menuimages && restaurant.menuimages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2" style={{ borderColor: '#97B067' }}>
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2F5249' }}>
                  Our Menu
                </h2>
                <div className="relative">
                  {/* Previous Button */}
                  {restaurant.menuimages.length > 3 && menuCarouselIndex > 0 && (
                    <button
                      onClick={() => setMenuCarouselIndex(prev => Math.max(0, prev - 3))}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all border-2"
                      style={{ borderColor: '#97B067' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6" style={{ color: '#2F5249' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Images Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {restaurant.menuimages.slice(menuCarouselIndex, menuCarouselIndex + 3).map((image, index) => (
                      <div
                        key={menuCarouselIndex + index}
                        className="rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 border-2"
                        style={{ borderColor: '#97B067' }}
                        onClick={() => setSelectedImage(getImageUrl(image))}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`Menu ${menuCarouselIndex + index + 1}`}
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            console.error('Failed to load menu image:', image);
                            e.target.src = getPlaceholderImage('menu');
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Next Button */}
                  {restaurant.menuimages.length > 3 && menuCarouselIndex + 3 < restaurant.menuimages.length && (
                    <button
                      onClick={() => setMenuCarouselIndex(prev => Math.min(restaurant.menuimages.length - 3, prev + 3))}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all border-2"
                      style={{ borderColor: '#97B067' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6" style={{ color: '#2F5249' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Image Counter */}
                  {restaurant.menuimages.length > 3 && (
                    <div className="text-center mt-4">
                      <span className="text-sm text-gray-600 font-medium">
                        Showing {menuCarouselIndex + 1}-{Math.min(menuCarouselIndex + 3, restaurant.menuimages.length)} of {restaurant.menuimages.length} images
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Restaurant Images Gallery */}
            {restaurant.restaurantImages && restaurant.restaurantImages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2" style={{ borderColor: '#97B067' }}>
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2F5249' }}>
                  Restaurant Gallery
                </h2>
                <div className="relative">
                  {/* Previous Button */}
                  {restaurant.restaurantImages.length > 3 && restaurantCarouselIndex > 0 && (
                    <button
                      onClick={() => setRestaurantCarouselIndex(prev => Math.max(0, prev - 3))}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all border-2"
                      style={{ borderColor: '#97B067' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6" style={{ color: '#2F5249' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Images Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {restaurant.restaurantImages.slice(restaurantCarouselIndex, restaurantCarouselIndex + 3).map((image, index) => (
                      <div
                        key={restaurantCarouselIndex + index}
                        className="aspect-square rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 border-2"
                        style={{ borderColor: '#97B067' }}
                        onClick={() => setSelectedImage(getImageUrl(image))}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`${restaurant.restaurantName} - ${restaurantCarouselIndex + index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Failed to load restaurant image:', image);
                            e.target.src = getPlaceholderImage('restaurant');
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Next Button */}
                  {restaurant.restaurantImages.length > 3 && restaurantCarouselIndex + 3 < restaurant.restaurantImages.length && (
                    <button
                      onClick={() => setRestaurantCarouselIndex(prev => Math.min(restaurant.restaurantImages.length - 3, prev + 3))}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all border-2"
                      style={{ borderColor: '#97B067' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6" style={{ color: '#2F5249' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Image Counter */}
                  {restaurant.restaurantImages.length > 3 && (
                    <div className="text-center mt-4">
                      <span className="text-sm text-gray-600 font-medium">
                        Showing {restaurantCarouselIndex + 1}-{Math.min(restaurantCarouselIndex + 3, restaurant.restaurantImages.length)} of {restaurant.restaurantImages.length} images
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Operating Hours / Timings */}
            {restaurant.timings && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2" style={{ borderColor: '#97B067' }}>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3" style={{ color: '#2F5249' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8"
                    style={{ color: '#97B067' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Operating Hours
                </h2>
                <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-6 border-2" style={{ borderColor: '#E8D77D' }}>
                  <p className="text-gray-800 text-lg font-medium leading-relaxed">
                    {restaurant.timings}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2" style={{ borderColor: '#97B067' }}>
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#2F5249' }}>
                Contact Information
              </h2>
              <div className="space-y-4 text-lg">
                {restaurant.phoneNumber && (
                  <p className="flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    <span className="font-semibold">Phone:</span>
                    <a href={`tel:${restaurant.phoneNumber}`} className="text-blue-600 hover:underline">
                      {restaurant.phoneNumber}
                    </a>
                  </p>
                )}
                {restaurant.email && (
                  <p className="flex items-center gap-3">
                    <span className="text-2xl">📧</span>
                    <span className="font-semibold">Email:</span>
                    <a href={`mailto:${restaurant.email}`} className="text-blue-600 hover:underline">
                      {restaurant.email}
                    </a>
                  </p>
                )}
                {restaurant.location && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">📌</span>
                    <div className="flex gap-2">
                      <span className="font-semibold flex-shrink-0">Address:</span>
                      <span className="text-gray-700">{restaurant.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card (Sticky) */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border-4" style={{ borderColor: '#97B067' }}>
                <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: '#2F5249' }}>
                  Make a Reservation
                </h2>
                
                {!isLoggedIn && (
                  <div className="text-center py-4 mb-4 bg-yellow-50 rounded-lg border-2" style={{ borderColor: '#E8D77D' }}>
                    <p className="text-lg font-semibold mb-3" style={{ color: '#2F5249' }}>
                      🔒 Login required to book
                    </p>
                    <Link
                      to="/user/auth"
                      className="inline-block px-6 py-2.5 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                      style={{ backgroundColor: '#437057' }}
                    >
                      Login / Sign Up
                    </Link>
                  </div>
                )}
                
                <div className={!isLoggedIn ? 'opacity-50 pointer-events-none' : ''}>
                  {isLoggedIn && getAvailableTableCount() > 0 && (
                    <div className="text-center mb-6">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm" style={{ backgroundColor: '#97B067', color: 'white' }}>
                        ✓ {getAvailableTableCount()} Tables Available
                      </span>
                    </div>
                  )}

                {bookingMessage && (
                  <div className={`mb-4 p-4 rounded-lg text-center ${bookingMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {bookingMessage}
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2F5249' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingData.name}
                      onChange={handleBookingChange}
                      required
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: '#97B067' }}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2F5249' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleBookingChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: '#97B067' }}
                      placeholder="10-digit phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2F5249' }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={bookingData.date}
                      onChange={handleBookingChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: '#97B067' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2F5249' }}>
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={bookingData.time}
                      onChange={handleBookingChange}
                      required
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: '#97B067' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2F5249' }}>
                      Number of People *
                    </label>
                    <select
                      name="totalPeople"
                      value={bookingData.totalPeople}
                      onChange={handleBookingChange}
                      required
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: '#97B067' }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2F5249' }}>
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequest"
                      value={bookingData.specialRequest}
                      onChange={handleBookingChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                      style={{ borderColor: '#97B067' }}
                      placeholder="Any special requests or dietary requirements?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-4 rounded-full font-bold text-white text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#2F5249' }}
                  >
                    {bookingLoading ? 'Booking...' : 'Book Now'}
                  </button>
                </form>

                <p className="text-sm text-gray-500 text-center mt-4">
                  * Required fields
                </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg hover:scale-110 transition-all"
              style={{ color: '#2F5249' }}
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
