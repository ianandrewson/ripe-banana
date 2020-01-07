const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
  role: String,
  actor: {
    type: mongoose.Types.ObjectId,
    ref: 'Actor',
    required: true
  }
});

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: mongoose.Types.ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true
  },
  cast: [castSchema]
});

module.exports = mongoose.model('Film', schema);
