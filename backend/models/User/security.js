const mongoose = require('mongoose');

const securitySchema = new mongoose.Schema({
  lastLogin: {
    type: Date
  },
  loginHistory: [{
    date: Date,
    ip: String,
    device: String,
    location: String
  }],
  securitySettings: {
    sessionTimeout: {
      type: Number,
      default: 30 // minutes
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    accountLockedUntil: Date
  }
});

module.exports = mongoose.model('Security', securitySchema);
