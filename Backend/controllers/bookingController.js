const Booking = require('../models/booking');

// Creating a new booking ( by User)
exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, specialRequest, date, time, noOfGuests, restaurantId } = req.body;

    if (!name || !phone || !date || !time || !noOfGuests || !restaurantId) {
      return res.status(400).json({
        message: 'All fields except specialRequest are required',
      });
    }

    const newBooking = new Booking({
      userId,
      restaurantId,
      name,
      phone,
      specialRequest,
      date,
      time,
      noOfGuests,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', data: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get all bookings by user
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};



// Delete  a booking 
exports.deleteBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    const booking = await Booking.findOne({ _id: bookingId, userId });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};


// ADMIN-SIDE  RESERVATIONS CONTROLLERS

// Get all pending reservations for a restaurant
exports.getPendingReservations = async (req, res) => {
  try {

    if (!req.admin || !req.admin.id) {
      return res.status(401).json({
        message: "Unauthorized. Admin ID not found in token.",
      });
    }

    const restaurantId = req.admin.id;

    const pending = await Booking.find({ restaurantId, status: 'pending' });

    if (!pending || pending.length === 0) {
      return res.status(404).json({ message: 'No pending reservations found' });
    }

    console.log(`Found ${pending.length} pending reservations.`);
    res.status(200).json({ data: pending });
  } catch (error) {
    console.error("Error in getPendingReservations:", error);
    res.status(500).json({
      message: 'Failed to fetch pending reservations',
      error: error.message,
    });
  }
};
// Confirm a reservation
exports.confirmReservation = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { confirmed: true, status: 'confirmed' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Reservation not found' });
    res.status(200).json({ message: 'Reservation confirmed', data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to confirm reservation', error: error.message });
  }
};

// Cancel a reservation
exports.cancelReservation = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', confirmed: false },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Reservation not found' });
    res.status(200).json({ message: 'Reservation cancelled', data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel reservation', error: error.message });
  }
};

// Get all confirmed reservations
exports.getConfirmedReservations = async (req, res) => {
  try {
    const restaurantId = req.admin.id; // Admin ID
    const confirmed = await Booking.find({ restaurantId, status: 'confirmed' });
    res.status(200).json({ data: confirmed });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch confirmed reservations', error: error.message });
  }
};

// Update arrival status (arriving/arrived)
exports.updateArrivalStatus = async (req, res) => {
  try {
    const { arrivalStatus } = req.body; // 'arriving' or 'arrived'
    if (!['arriving', 'arrived'].includes(arrivalStatus)) {
      return res.status(400).json({ message: 'Invalid arrival status value' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { arrivalStatus },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.status(200).json({ message: 'Arrival status updated', data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update arrival status', error: error.message });
  }
};
