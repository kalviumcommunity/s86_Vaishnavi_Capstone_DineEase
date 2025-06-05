const Reservation = require('../models/reservations');


// Get all pending reservations
exports.getPendingReservations = async (req, res) => {
  try {
    const pending = await Reservation.find({ confirmed: false });
    if(!pending){
   return  res.status(400).json({msg:" no bookings available "})
 }
    res.json(pending);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending reservations',error});
    console.log(error);
  }
};