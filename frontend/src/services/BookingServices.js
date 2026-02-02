import api from './Api';

// =================== USER BOOKING SERVICES =================== //

/**
 * Create a new booking (User side)
 * @param {Object} bookingData - { name, phone, specialRequest, date, time, totalPeople, restaurantId }
 * @returns {Promise} Created booking data
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings/book', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create booking' };
  }
};

/**
 * Get all bookings for logged-in user
 * @returns {Promise} Array of user bookings
 */
export const getMyBookings = async () => {
  try {
    const response = await api.get('/bookings/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch bookings' };
  }
};

/**
 * Cancel/Delete a booking (User side)
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cancel booking' };
  }
};

// =================== DEFAULT EXPORT =================== //

const BookingServices = {
  createBooking,
  getMyBookings,
  deleteBooking,
};

export default BookingServices;
