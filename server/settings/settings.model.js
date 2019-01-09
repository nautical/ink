const mongoose = require('mongoose');

/**
 * Settings Schema
 */
const SettingsSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companySlug: {
    type: String,
    unique: true,
    required: true
  },
  companyName: {
    type: String
  },
  companyWebsite: {
    type: String
  },
  companyAddress: {
    type: String
  },
  companyLogo: {
    type: String
  },
  companyTeam: {
    type: Array
  },
  notifications: {
    type: String
  },
  language: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * @typedef Settings
 */
module.exports = mongoose.model('Settings', SettingsSchema);
