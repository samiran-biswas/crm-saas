const mongoose = require('mongoose');
const { hashPassword, comparePasswords } = require('../../utils/authUtils');
const { generateToken } = require('../../utils/jwtUtils');

const authSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    token: {
      type: String,
      required: true
    },
    device: {
      type: String
    },
    lastUsed: {
      type: Date,
      default: Date.now
    }
  }],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
});

// Hash password before saving
authSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});

// Generate auth token
authSchema.methods.generateAuthToken = async function(device = 'unknown') {
  const token = generateToken({ userId: this._id });
  this.tokens = this.tokens.concat({ token, device });
  await this.save();
  return token;
};

// Remove token
authSchema.methods.removeToken = async function(token) {
  this.tokens = this.tokens.filter(t => t.token !== token);
  await this.save();
};

// Compare password
authSchema.methods.comparePassword = async function(password) {
  return comparePasswords(password, this.password);
};

// Generate password reset token
authSchema.methods.generatePasswordResetToken = function() {
  const resetToken = generateToken({ userId: this._id }, '1h');
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  return resetToken;
};

// Generate email verification token
authSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = generateToken({ userId: this._id }, '24h');
  this.emailVerificationToken = verificationToken;
  this.emailVerificationExpires = Date.now() + 86400000; // 24 hours
  return verificationToken;
};

module.exports = mongoose.model('Auth', authSchema);
