const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  listened: {
    type: Number,
    required: true,
  },
  favourited: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Song', songSchema);
