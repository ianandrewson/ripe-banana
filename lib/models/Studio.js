const mongoose = require('mongoose');

const addressSchema  = new mongoose.Schema({
  city: String,
  state: String,
  country: String
});

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: addressSchema
});

schema.virtual('films', {
  ref: 'Film',
  localField: '_id',
  foreignField: 'studio'
});

module.exports = mongoose.model('Studio', schema);
