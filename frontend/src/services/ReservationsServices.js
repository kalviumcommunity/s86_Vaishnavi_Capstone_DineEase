import api from './Api';

// =================== RESTAURANT RESERVATION MANAGEMENT SERVICES =================== //

/**
 * Get all pending reservations (Restaurant side)
 * @returns {Promise} Array of pending reservations
 */
export const getPendingReservations = async () => {
  try {
    const response = await api.get('/bookings/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch pending reservations' };
  }
};

/**
 * Confirm a reservation (Restaurant side)
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Updated booking data
 */
export const confirmReservation = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/confirm/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to confirm reservation' };
  }
};

/**
 * Cancel a reservation (Restaurant side)
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Updated booking data
 */
export const cancelReservation = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/cancel/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cancel reservation' };
  }
};

/**
 * Get all confirmed reservations (Restaurant side)
 * @returns {Promise} Array of confirmed reservations
 */
export const getConfirmedReservations = async () => {
  try {
    const response = await api.get('/bookings/confirmed');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch confirmed reservations' };
  }
};

/**
 * Update arrival status of a reservation (Restaurant side)
 * @param {string} bookingId - Booking ID
 * @param {string} arrivalStatus - "arriving" or "arrived"
 * @returns {Promise} Updated booking data
 */
export const updateArrivalStatus = async (bookingId, arrivalStatus) => {
  try {
    const response = await api.put(`/bookings/arrival/${bookingId}`, {
      arrivalStatus,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update arrival status' };
  }
};

// =================== DEFAULT EXPORT =================== //

const ReservationsServices = {
  getPendingReservations,
  confirmReservation,
  cancelReservation,
  getConfirmedReservations,
  updateArrivalStatus,
};

export default ReservationsServices;
