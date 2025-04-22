const User = require('../models/user');
const UserModel = require('../models/userModel');
const Auth = require('../models/auth');
const Security = require('../models/security');
const Preferences = require('../models/preferences');
const Role = require('../models/role');
const { generateToken } = require('../utils/jwtUtils');
const { sendEmail } = require('../utils/emailService'); // You'll implement this
const crypto = require('crypto');

// Register
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const role = await Role.findOne({ name: 'Admin' });

    const user = await User.create({ firstName, lastName, email, role: role._id });

    const auth = await Auth.create({ password });
    const security = await Security.create({});
    const preferences = await Preferences.create({});

    await UserModel.create({
      userInfo: user._id,
      authInfo: auth._id,
      securityInfo: security._id,
      preferencesInfo: preferences._id
    });

    const token = auth.generateEmailVerificationToken();
    await auth.save();

    await sendEmail(email, 'Verify your email', `Your OTP: ${token}`);

    res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Email OTP Verification
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });

    const userModel = await UserModel.findOne({ userInfo: user._id }).populate('authInfo');
    const auth = userModel.authInfo;

    if (auth.emailVerificationToken !== otp || auth.emailVerificationExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isEmailVerified = true;
    auth.emailVerificationToken = undefined;
    auth.emailVerificationExpires = undefined;
    await user.save();
    await auth.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const userModel = await UserModel.findOne({ userInfo: user._id }).populate('authInfo');
    const auth = userModel.authInfo;

    const isMatch = await auth.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = await auth.generateAuthToken();

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email not found' });

    const userModel = await UserModel.findOne({ userInfo: user._id }).populate('authInfo');
    const auth = userModel.authInfo;

    const token = auth.generatePasswordResetToken();
    await auth.save();

    await sendEmail(email, 'Reset your password', `Reset Token: ${token}`);

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    const user = await User.findOne({ email });
    const userModel = await UserModel.findOne({ userInfo: user._id }).populate('authInfo');
    const auth = userModel.authInfo;

    if (
      auth.resetPasswordToken !== token ||
      auth.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    auth.password = newPassword;
    auth.resetPasswordToken = undefined;
    auth.resetPasswordExpires = undefined;

    await auth.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
