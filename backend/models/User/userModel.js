const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true
  },
  securityInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Security',
    required: true
  },
  preferencesInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Preferences',
    required: true
  }
});

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel;
