import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllTables } from "../../services/TableServices";
import { 
  getPendingReservations, 
  getConfirmedReservations 
} from "../../services/ReservationsServices";
import Loader from "../../components/common/Loader";

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [restaurantData, setRestaurantData] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTables: 0,
    availableTables: 0,
    occupiedTables: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    todayBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load restaurant data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setRestaurantData(userData);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch tables data
      const tablesResponse = await getAllTables();
      const tables = tablesResponse.tables || [];
      
      // Fetch bookings data
      const [pendingRes, confirmedRes] = await Promise.all([
        getPendingReservations(),
        getConfirmedReservations()
      ]);
      
      const pendingBookings = pendingRes.data || [];
      const confirmedBookings = confirmedRes.data || [];
      const allBookings = [...pendingBookings, ...confirmedBookings];
      
      // Calculate today's bookings
      const today = new Date().toDateString();
      const todayBookings = allBookings.filter(booking => {
        const bookingDate = new Date(booking.date).toDateString();
        return bookingDate === today;
      });
      
      // Calculate stats
      const availableTables = tables.filter(table => table.available).length;
      
      setStats({
        totalTables: tables.length,
        availableTables: availableTables,
        occupiedTables: tables.length - availableTables,
        totalBookings: allBookings.length,
        pendingBookings: pendingBookings.length,
        confirmedBookings: confirmedBookings.length,
        todayBookings: todayBookings.length,
      });
      
      // Get recent bookings (last 5)
      const sortedBookings = allBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBookings(sortedBookings);
      
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (time) => {
    // If time is in 24-hour format (HH:MM), convert to 12-hour
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <header className="w-full text-white shadow-lg" style={{ background: 'linear-gradient(to right, #2F5249, #437057, #97B067)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {restaurantData.restaurantName || "Restaurant Dashboard"}
            </h1>
            <p className="text-green-100 text-sm">Admin Control Panel</p>
          </div>

          {/* Profile Icon */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center w-11 h-11 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/20 transition-all border-2 border-white/20"
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
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-2xl py-2 z-50 border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {restaurantData.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{restaurantData.email}</p>
                </div>
                <Link
                  to="/restaurant/profile"
                  className="block w-full text-left px-4 py-2 hover:bg-green-50 transition text-gray-700"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-50 transition text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {restaurantData.name?.split(" ")[0] || "Admin"}! 👋
          </h2>
          <p className="text-gray-600">
            Here's an overview of your restaurant's performance today.
          </p>
          <button
            onClick={fetchDashboardData}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg"
            style={{ backgroundColor: '#437057' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2F5249'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#437057'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-red-500 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tables */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(67, 112, 87, 0.15)' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7"
                  style={{ color: '#437057' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 font-medium text-sm mb-1">Total Tables</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalTables}</p>
          </div>

          {/* Available Tables */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 font-medium text-sm mb-1">Available Tables</h3>
            <p className="text-3xl font-bold text-green-600">{stats.availableTables}</p>
          </div>

          {/* Pending Bookings */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(56, 178, 172, 0.2)' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7"
                  style={{ color: '#38b2ac' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 font-medium text-sm mb-1">Pending Bookings</h3>
            <p className="text-3xl font-bold" style={{ color: '#38b2ac' }}>{stats.pendingBookings}</p>
          </div>

          {/* Today's Bookings */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(151, 176, 103, 0.2)' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7"
                  style={{ color: '#97B067' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 font-medium text-sm mb-1">Today's Bookings</h3>
            <p className="text-3xl font-bold" style={{ color: '#97B067' }}>{stats.todayBookings}</p>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-white rounded-2xl shadow-lg p-6" style={{ background: 'linear-gradient(to bottom right, #437057, #2F5249)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Confirmed Bookings</p>
                <p className="text-4xl font-bold">{stats.confirmedBookings}</p>
              </div>
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-white rounded-2xl shadow-lg p-6" style={{ background: 'linear-gradient(to bottom right, #6B8E23, #556B2F)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-50 text-sm mb-1">Occupied Tables</p>
                <p className="text-4xl font-bold">{stats.occupiedTables}</p>
              </div>
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-white rounded-2xl shadow-lg p-6" style={{ background: 'linear-gradient(to bottom right, #97B067, #7d9555)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-50 text-sm mb-1">Total Bookings</p>
                <p className="text-4xl font-bold">{stats.totalBookings}</p>
              </div>
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Info Hub Card */}
          <Link
            to="/restaurant/info-hub"
            className="text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 group transform hover:-translate-y-1"
            style={{ background: 'linear-gradient(to bottom right, #437057, #2F5249)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 transform group-hover:translate-x-2 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Info Hub</h3>
            <p className="text-green-100">
              Update restaurant details, menu, and information visible to customers
            </p>
          </Link>

          {/* Table Management Card */}
          <Link
            to="/restaurant/tables"
            className="text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 group transform hover:-translate-y-1"
            style={{ background: 'linear-gradient(to bottom right, #97B067, #7d9555)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 transform group-hover:translate-x-2 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Table Management</h3>
            <p className="text-green-100">
              Add, update, and manage your restaurant tables and seating
            </p>
          </Link>

          {/* Reservations Card */}
          <Link
            to="/restaurant/reservations"
            className="text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 group transform hover:-translate-y-1 relative"
            style={{ background: 'linear-gradient(to bottom right, #38b2ac, #2c8a85)' }}
          >
            {stats.pendingBookings > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                {stats.pendingBookings} Pending
              </span>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 transform group-hover:translate-x-2 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Reservations</h3>
            <p className="text-teal-50">
              View and manage all customer reservations and bookings
            </p>
          </Link>
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Recent Bookings</h3>
            <Link
              to="/restaurant/reservations"
              className="font-medium text-sm flex items-center gap-1 transition"
              style={{ color: '#437057' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#2F5249'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#437057'}
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No bookings yet</p>
              <p className="text-gray-500 text-sm mt-1">New bookings will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className={`p-3 rounded-xl ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100' 
                      : booking.status === 'pending' 
                      ? 'bg-yellow-100' 
                      : 'bg-red-100'
                  }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className={`w-6 h-6 ${
                        booking.status === 'confirmed' 
                          ? 'text-green-600' 
                          : booking.status === 'pending' 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900">{booking.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.date)} at {formatTime(booking.time)} • {booking.totalPeople} {booking.totalPeople === 1 ? 'person' : 'people'}
                    </p>
                    {booking.specialRequest && (
                      <p className="text-xs text-gray-500 mt-1 italic">"{booking.specialRequest}"</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{getTimeAgo(booking.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
