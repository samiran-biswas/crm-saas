const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  company: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  // Login history
  lastLogin: {
    type: Date
  },
  loginHistory: [{
    date: Date,
    ip: String,
    device: String,
    location: String
  }],
  // Security settings
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
  },
  // Tokens for authentication
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
  // User preferences
  preferences: {
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
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  user.updatedAt = Date.now();
  next();
});

// Generate auth token
userSchema.methods.generateAuthToken = async function(device = 'unknown') {
  const user = this;
  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  user.tokens = user.tokens.concat({ token, device });
  await user.save();
  return token;
};

// Remove token
userSchema.methods.removeToken = async function(token) {
  this.tokens = this.tokens.filter(t => t.token !== token);
  await this.save();
};

// Compare password
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  return resetToken;
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  this.emailVerificationToken = verificationToken;
  this.emailVerificationExpires = Date.now() + 86400000; // 24 hours
  return verificationToken;
};

// Check if user has permission
userSchema.methods.hasPermission = async function(feature, permission) {
  await this.populate('role');
  return this.role?.permissions[feature]?.[permission] === true;
};

// Check subscription level
userSchema.methods.checkSubscriptionLevel = async function(requiredLevel) {
  await this.populate('role');
  const subscriptionLevels = ['basic', 'pro', 'enterprise'];
  const userLevel = subscriptionLevels.indexOf(this.role.subscriptionLevel);
  const requiredLevelIndex = subscriptionLevels.indexOf(requiredLevel);
  return userLevel >= requiredLevelIndex;
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 