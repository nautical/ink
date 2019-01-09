const mongoose = require('mongoose');

/**
 * Apply Schema : Only for application log purposes
 */
const ApplySchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  answers: {
    type: Array,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  questions: {
    type: Array,
    required: true
  },
  meta: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'applied'
  },
  notes: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 1
  }
});

/**
 * @typedef Apply
 */
module.exports = mongoose.model('Apply', ApplySchema);
