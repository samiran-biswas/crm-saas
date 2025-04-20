const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Ticket = require('../models/Ticket');

// @route   GET /api/dashboard
// @desc    Get dashboard data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const [
      totalLeads,
      totalCustomers,
      openTickets,
      monthlyRevenue
    ] = await Promise.all([
      Lead.countDocuments(),
      Customer.countDocuments(),
      Ticket.countDocuments({ status: 'open' }),
      // For now, using a static value for monthly revenue
      Promise.resolve(5000)
    ]);

    res.json({
      success: true,
      data: {
        totalLeads,
        totalCustomers,
        openTickets,
        monthlyRevenue
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({
      success: false,
      msg: 'Server error'
    });
  }
});

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // TODO: Implement dashboard statistics
    res.json({
      success: true,
      data: {
        totalLeads: 0,
        totalCustomers: 0,
        totalTickets: 0,
        openTickets: 0,
        recentActivities: []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
router.get('/activities', auth, async (req, res) => {
  try {
    // TODO: Implement recent activities
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 