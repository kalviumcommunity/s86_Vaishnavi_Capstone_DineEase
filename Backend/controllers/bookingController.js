const Booking = require('../models/booking');

// ✅ User creates booking
exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, specialRequest, date, time, totalPeople, restaurantId } = req.body;

    if (!name || !phone || !date || !time || !totalPeople || !restaurantId) {
      return res.status(400).json({ message: "All fields except specialRequest are required" });
    }

    const newBooking = new Booking({
      userId,
      restaurantId,
      name,
      phone,
      specialRequest,
      date,
      time,
      totalPeople
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", data: newBooking });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// Get logged-in user bookings
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// User cancels their booking
exports.deleteBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    const booking = await Booking.findOne({ _id: bookingId, userId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ message: "Booking cancelled successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking", error: error.message });
  }
};

//  RESTAURANT SIDE

//Get pending reservations
exports.getPendingBookings = async (req, res) => {
  try {
    const restaurantId = req.user.id;
    const pending = await Booking.find({ restaurantId, status: "pending" });

    res.status(200).json({ data: pending });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending reservations", error: error.message });
  }
};

//Confirm reservation
exports.confirmBookings = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { confirmed: true, status: "confirmed" },
      { new: true }
    );

    res.status(200).json({ message: "Reservation confirmed", data: booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to confirm reservation", error: error.message });
  }
};

//Cancel reservation
exports.cancelBookings = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { confirmed: false, status: "cancelled" },
      { new: true }
    );

    res.status(200).json({ message: "Reservation cancelled", data: booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel reservation", error: error.message });
  }
};

//Get confirmed reservations
exports.getConfirmedBookings = async (req, res) => {
  try {
    const restaurantId = req.user.id;
    const confirmed = await Booking.find({ restaurantId, status: "confirmed" });

    res.status(200).json({ data: confirmed });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch confirmed reservations", error: error.message });
  }
};

//Update arrival status
exports.updateArrivalStatus = async (req, res) => {
  try {
    const { arrivalStatus } = req.body;

    if (!["arriving", "arrived"].includes(arrivalStatus)) {
      return res.status(400).json({ message: "Invalid arrival status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { arrivalStatus },
      { new: true }
    );

    res.status(200).json({ message: "Arrival status updated", data: booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to update arrival status", error: error.message });
  }
};
