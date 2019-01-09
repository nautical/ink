const mongoose = require('mongoose');

/**
 * User Schema : Only for general Log purposes
 */
const QAsSchema = new mongoose.Schema({
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
  qa: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  qaHistory: {
    // push here everytime u make a change along with timestamp
    type: Array,
    default: []
  }
});

/**
 * @typedef User
 */
module.exports = mongoose.model('QAs', QAsSchema);
