import { Routes, Route } from "react-router-dom";

// Public Pages
import HomePage from "../pages/public/HomePage";
import UserAuth from "../pages/public/UserAuth";
import RestaurantAuth from "../pages/public/RestaurantAuth";
import GoogleCallback from "../pages/public/GoogleCallback";
import ResetPassword from "../pages/public/ResetPassword";

// User Pages
import UserDashboard from "../pages/user/UserDashboard";
import UserProfile from "../pages/user/UserProfile";
import UserBookingPage from "../pages/user/UserBookingPage";
import RestaurantListPage from "../pages/user/RestaurantListPage";
import RestaurantDetails from "../pages/user/RestaurantDetails";

// Restaurant Pages
import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";
import InfoHubPage from "../pages/restaurant/InfoHubPage";
import TablePage from "../pages/restaurant/TablePage";
import RestaurantProfile from "../pages/restaurant/RestaurantProfile";
import ReservationsManagment from "../pages/restaurant/ReservationsManagment";
import PendingReservationsPage from "../pages/restaurant/PendingReservationsPage";
import ConfirmedReservationsPage from "../pages/restaurant/ConfirmedReservationsPage";


const AppRouter = () => {
  return (
    <Routes>
        
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/user/auth" element={<UserAuth />} />
      <Route path="/restaurant/auth" element={<RestaurantAuth />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/reset-password/:token/:userType" element={<ResetPassword />} />
      <Route path="/restaurants" element={<RestaurantListPage />} />
      <Route path="/restaurant/:id" element={<RestaurantDetails />} />
      
      {/* User Routes */}
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/profile" element={<UserProfile />} />
      <Route path="/user/bookings" element={<UserBookingPage />} />
      <Route path="/user/restaurants" element={<RestaurantListPage />} />
      <Route path="/user/restaurant/:id" element={<RestaurantDetails />} />

      {/* Restaurant Routes */}
      <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
      <Route path="/restaurant/profile" element={<RestaurantProfile />} />
      <Route path="/restaurant/info-hub" element={<InfoHubPage />} />
      <Route path="/restaurant/tables" element={<TablePage />} />
      <Route path="/restaurant/reservations" element={<ReservationsManagment />} />
      <Route path="/restaurant/reservations/pending" element={<PendingReservationsPage />} />
      <Route path="/restaurant/reservations/confirmed" element={<ConfirmedReservationsPage />} />

      
    </Routes>
  );
};

export default AppRouter;
