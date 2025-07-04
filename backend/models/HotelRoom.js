const mongoose = require('mongoose');

const hotelRoomSchema = new mongoose.Schema({
  bed_count: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  images: { // Changed from 'image' to 'images'
    type: [String], // Array of strings
    required: false,
    default: [] // Default empty array
  },
  // Foreign key reference to Hotel
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hotel',
    required: true
  },
  book_dates: {
    type: [String],
    required: false,
    default: []
  }
});

module.exports = mongoose.model('hotel_room', hotelRoomSchema);
