const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        msg: 'Please provide all required fields' 
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false,
        msg: 'User already exists' 
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Save user (password will be hashed by pre-save middleware)
    await user.save();

    // Create JWT token
    const token = user.getSignedJwtToken();

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscription
    };

    res.status(201).json({
      success: true,
      token,
      user: userData
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      msg: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = user.getSignedJwtToken();

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscription
    };

    res.json({
      success: true,
      token,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      msg: 'Server error during login'
    });
  }
});

module.exports = router; 