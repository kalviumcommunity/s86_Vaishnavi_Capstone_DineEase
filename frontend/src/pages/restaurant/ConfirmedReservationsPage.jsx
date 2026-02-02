import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getConfirmedReservations, updateArrivalStatus } from "../../services/ReservationsServices";

const ConfirmedReservationsPage = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchConfirmedReservations();
  }, []);

  // Fetch both confirmed and cancelled bookings for this restaurant
  const fetchConfirmedReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getConfirmedReservations();
      // If backend only returns confirmed, fetch cancelled as well (customize as needed)
      // For now, assume response.data may include cancelled if backend is updated
      setReservations(response.data || []);
    } catch (err) {
      console.error("Error fetching confirmed reservations:", err);
      setError("Failed to load confirmed reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleArrivalStatus = async (bookingId, status) => {
    try {
      await updateArrivalStatus(bookingId, status);
      alert(`Guest marked as ${status}!`);
      fetchConfirmedReservations();
    } catch (err) {
      console.error("Error updating arrival status:", err);
      alert("Failed to update arrival status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Filter reservations based on search and time
  // Show both confirmed and cancelled bookings, but hide those more than 24 hours past
  const filteredReservations = reservations.filter((reservation) => {
    // First, filter out bookings that are more than 24 hours past their scheduled time
    const bookingDateTime = new Date(reservation.date);
    const [hours, minutes] = reservation.time.split(':');
    bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const now = new Date();
    const twentyFourHoursAfterBooking = new Date(bookingDateTime.getTime() + (24 * 60 * 60 * 1000));
    const isPast24Hours = now > twentyFourHoursAfterBooking;
    
    // Don't show bookings that are more than 24 hours past
    if (isPast24Hours) {
      return false;
    }
    
    // Then apply search filter
    const searchLower = searchTerm.toLowerCase();
    return (
      reservation.name?.toLowerCase().includes(searchLower) ||
      reservation.phone?.includes(searchTerm)
    );
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="w-full text-white shadow-lg" style={{ backgroundColor: '#2F5249' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/restaurant/dashboard" className="text-2xl font-bold hover:scale-105 transition-transform duration-300" style={{ color: '#E8D77D' }}>
            DineEase.com
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/restaurant/dashboard"
              className="px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all"
            >
              Dashboard
            </Link>
            
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 transform hover:scale-110"
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
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-2xl py-2 z-50 border-2" style={{ borderColor: '#97B067' }}>
                  <Link
                    to="/restaurant/dashboard"
                    className="block px-4 py-2 hover:bg-green-50 transition-all"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/restaurant/profile"
                    className="block px-4 py-2 hover:bg-green-50 transition-all"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8" style={{ backgroundColor: '#F5F1E8' }}>
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold" style={{ color: '#2F5249' }}>
              Confirmed Reservations
            </h1>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/restaurant/reservations/pending")}
                className="px-6 py-3 rounded-lg font-semibold transition-all bg-white border-2 hover:bg-green-50"
                style={{ borderColor: '#97B067', color: '#437057' }}
              >
                Pending
              </button>
              <button
                onClick={() => navigate("/restaurant/reservations/confirmed")}
                className="px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
                style={{ backgroundColor: '#437057', color: '#E8D77D' }}
              >
                Confirmed
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#97B067' }}
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1 rounded-lg font-medium"
                style={{ backgroundColor: '#437057', color: 'white' }}
              >
                →
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 rounded-full animate-spin" 
                style={{ borderColor: '#97B067', borderTopColor: 'transparent' }}></div>
              <p className="mt-4 text-gray-600">Loading reservations...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl">
              {error}
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" 
                style={{ backgroundColor: '#E8D77D30' }}>
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
                No Confirmed Reservations
              </h3>
              <p className="text-gray-600">No confirmed bookings at the moment.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead style={{ backgroundColor: '#8B6F47' }}>
                  <tr className="text-white">
                    <th className="px-6 py-4 text-left font-semibold">S.NO</th>
                    <th className="px-6 py-4 text-left font-semibold">NAME</th>
                    <th className="px-6 py-4 text-left font-semibold">PHONE NO</th>
                    <th className="px-6 py-4 text-left font-semibold">DATE</th>
                    <th className="px-6 py-4 text-left font-semibold">TIME</th>
                    <th className="px-6 py-4 text-left font-semibold">NO OF GUESTS</th>
                    <th className="px-6 py-4 text-center font-semibold">ARRIVED</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation, index) => (
                    <tr 
                      key={reservation._id} 
                      className="border-b hover:bg-green-50 transition-colors"
                      style={{ backgroundColor: index % 2 === 0 ? '#F9F7F4' : 'white' }}
                    >
                      <td className="px-6 py-4">{index + 1}.</td>
                      <td className="px-6 py-4 font-medium">{reservation.name}</td>
                      <td className="px-6 py-4">{reservation.phone}</td>
                      <td className="px-6 py-4">
                        {new Date(reservation.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit"
                        })}
                      </td>
                      <td className="px-6 py-4">{reservation.time}</td>
                      <td className="px-6 py-4 text-center">{reservation.totalPeople}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          {reservation.status === 'cancelled' ? (
                            <span className="px-6 py-2 rounded-lg font-semibold text-white bg-red-600">
                              {reservation.cancellationSource === 'user'
                                ? '✕ Cancelled by User'
                                : '✕ Cancelled by Restaurant'}
                            </span>
                          ) : reservation.arrivalStatus === "arrived" ? (
                            <span className="px-6 py-2 rounded-lg font-semibold text-white bg-green-600">
                              ✓ Arrived
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleArrivalStatus(reservation._id, "arrived")}
                                className="px-6 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 shadow-md"
                                style={{ backgroundColor: '#437057' }}
                              >
                                YES
                              </button>
                              <button
                                className="px-6 py-2 rounded-lg font-semibold text-white bg-gray-800 hover:bg-gray-900 transition-all hover:scale-105 shadow-md"
                                disabled
                              >
                                NO
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmedReservationsPage;
