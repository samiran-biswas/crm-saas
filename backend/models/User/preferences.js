const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  timezone: {
    type: String,
    default: 'UTC'
  }
});

module.exports = mongoose.model('Preferences', preferencesSchema);
