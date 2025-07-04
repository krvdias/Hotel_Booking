const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hotel_room',
    required: true
  },
  check_in: Date,
  check_out: Date,
  price: {
    type: String,
    required: true
  },
  days_count: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('booking', bookingSchema);