const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('admin', adminSchema);
