const mongoose = require('mongoose');

/**
 * Sources Schema
 */
const SourcesSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  desc: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * @typedef Sources
 */
module.exports = mongoose.model('Sources', SourcesSchema);
