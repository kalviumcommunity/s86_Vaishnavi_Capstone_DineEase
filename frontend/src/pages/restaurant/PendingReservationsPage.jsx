import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPendingReservations, confirmReservation, cancelReservation } from "../../services/ReservationsServices";

const PendingReservationsPage = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPendingReservations();
  }, []);

  const fetchPendingReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getPendingReservations();
      setReservations(response.data || []);
    } catch (err) {
      console.error("Error fetching pending reservations:", err);
      setError("Failed to load pending reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    if (!window.confirm("Are you sure you want to confirm this reservation?")) {
      return;
    }

    try {
      await confirmReservation(bookingId);
      alert("Reservation confirmed successfully!");
      fetchPendingReservations();
    } catch (err) {
      console.error("Error confirming reservation:", err);
      alert("Failed to confirm reservation");
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm("Are you sure you want to reject this reservation?")) {
      return;
    }

    try {
      await cancelReservation(bookingId);
      alert("Reservation cancelled successfully");
      fetchPendingReservations();
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      alert("Failed to cancel reservation");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Filter reservations based on search
  const filteredReservations = reservations.filter((reservation) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reservation.name?.toLowerCase().includes(searchLower) ||
      reservation.phone?.includes(searchTerm)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-green-50">
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
              Pending Reservations
            </h1>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/restaurant/reservations/pending")}
                className="px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
                style={{ backgroundColor: '#437057', color: '#E8D77D' }}
              >
                Pending
              </button>
              <button
                onClick={() => navigate("/restaurant/reservations/confirmed")}
                className="px-6 py-3 rounded-lg font-semibold transition-all bg-white border-2 hover:bg-green-50"
                style={{ borderColor: '#97B067', color: '#437057' }}
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#2F5249' }}>
                No Pending Reservations
              </h3>
              <p className="text-gray-600">All reservations have been processed.</p>
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
                    <th className="px-6 py-4 text-center font-semibold">ACTIONS</th>
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
                          <button
                            onClick={() => handleConfirm(reservation._id)}
                            className="px-6 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 shadow-md"
                            style={{ backgroundColor: '#437057' }}
                          >
                            YES
                          </button>
                          <button
                            onClick={() => handleReject(reservation._id)}
                            className="px-6 py-2 rounded-lg font-semibold text-white bg-gray-800 hover:bg-gray-900 transition-all hover:scale-105 shadow-md"
                          >
                            NO
                          </button>
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

export default PendingReservationsPage;
