// models/booking.js

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    specialRequest: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    totalPeople: {
      type: Number,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },

    confirmed: {
      type: Boolean,
      default: false
    },

    arrivalStatus: {
      type: String,
      enum: ['not arrived', 'arriving', 'arrived'],
      default: 'not arrived'
    },

    cancellationSource: {
      type: String,
      enum: ['user', 'restaurant', null],
      default: null
    },

    cancellationReason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
