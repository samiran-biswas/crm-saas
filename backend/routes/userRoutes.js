const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', auth, getMe);
router.put('/me', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.put('/preferences', auth, updatePreferences);
router.post('/logout', auth, logout);
router.post('/logout-all', auth, logoutAll);

module.exports = router; 