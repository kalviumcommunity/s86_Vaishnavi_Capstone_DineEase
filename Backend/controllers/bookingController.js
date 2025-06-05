const Booking = require('../models/booking');


//Add a booking
exports.createBooking = async (req, res) => {
  try {
    console.log('Decoded JWT user:', req.user);
    const userId = req.user.id;
    const { name, phone, specialRequest, date, time, noOfGuests, restaurantId } = req.body;

    if (!name || !phone || !date || !time || !noOfGuests || !restaurantId) {
      return res.status(400).json({
        message: 'All fields except specialRequest are required'
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
      noOfGuests
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', data: newBooking });
  } catch (error) {
    console.error('Error creating booking :', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get My Bookings
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ userId });

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};