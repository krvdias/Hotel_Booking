const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  hotel_name: {
    type: String,
    required: true
  },
  hotel_address: {
    type: String,
    required: true
  },
  hotel_owner: {
    type: String,
    required: true
  },
  hotel_image: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('hotel', hotelSchema);
