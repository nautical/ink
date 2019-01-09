const mongoose = require('mongoose');

/**
 * User Schema : Only for application log purposes
 */
const ApplicationSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sources',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * @typedef User
 */
module.exports = mongoose.model('Application', ApplicationSchema);
