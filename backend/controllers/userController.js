const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');
const { generateError } = require('../utils/errorHandler');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
const register = async (req, res, next) => {
  try {
    console.log('Registration request received:', req.body);
    const { firstName, lastName, email, password, company, position, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      console.log('Missing required fields');
      return next(generateError('Missing required fields', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return next(generateError('User already exists', 400));
    }

    // Get or create admin role
    let adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      console.log('Creating new admin role');
      adminRole = await Role.create({
        name: 'admin',
        description: 'Administrator with elevated access',
        permissions: {
          dashboard: true,
          leads: { view: true, create: true, edit: true, delete: true },
          customers: { view: true, create: true, edit: true, delete: true },
          tickets: { view: true, create: true, edit: true, delete: true },
          tasks: { view: true, create: true, edit: true, delete: true },
          meetings: { view: true, create: true, edit: true, delete: true },
          analytics: { view: true, export: true },
          settings: { view: true, edit: true },
          users: { view: true, create: true, edit: true, delete: true }
        },
        subscriptionLevel: 'enterprise',
        isActive: true
      });
    }

    console.log('Creating new user with admin role');
    // Create user with admin role
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      company,
      position,
      phone,
      role: adminRole._id,
      isEmailVerified: true, // Auto-verify admin users
      securitySettings: {
        sessionTimeout: 60,
        failedLoginAttempts: 0
      }
    });

    console.log('User created successfully:', user.email);
    // Generate token
    const token = await user.generateAuthToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(generateError('Invalid credentials', 401));
    }

    // Check if account is locked
    if (user.securitySettings.accountLockedUntil > Date.now()) {
      return next(generateError('Account is locked. Try again later.', 401));
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.securitySettings.failedLoginAttempts += 1;
      if (user.securitySettings.failedLoginAttempts >= 5) {
        user.securitySettings.accountLockedUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
      }
      await user.save();
      return next(generateError('Invalid credentials', 401));
    }

    // Reset failed attempts on successful password verification
    user.securitySettings.failedLoginAttempts = 0;
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = await user.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -tokens')
      .populate('role');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, company, position, phone } = req.body;
    const user = await User.findById(req.user.id);

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.company = company || user.company;
    user.position = position || user.position;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(generateError('Current password is incorrect', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(generateError('No user found with this email', 404));
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You are receiving this email because you requested a password reset.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(generateError('Invalid or expired token', 400));
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = async (req, res, next) => {
  try {
    const { theme, notifications, timezone } = req.body;
    const user = await User.findById(req.user.id);

    if (theme) user.preferences.theme = theme;
    if (notifications) user.preferences.notifications = notifications;
    if (timezone) user.preferences.timezone = timezone;

    await user.save();

    res.status(200).json({
      success: true,
      data: user.preferences
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.tokens = user.tokens.filter(token => token.token !== req.token);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout from all devices
// @route   POST /api/users/logout-all
// @access  Private
const logoutAll = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.tokens = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  updatePreferences,
  logout,
  logoutAll
}; 