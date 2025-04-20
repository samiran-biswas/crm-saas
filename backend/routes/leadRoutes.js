const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Lead = require('../models/Lead');

// @route   GET /api/leads
// @desc    Get all leads
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: leads
    });
  } catch (err) {
    console.error('Get leads error:', err);
    res.status(500).json({
      success: false,
      msg: 'Server error'
    });
  }
});

// @route   POST /api/leads
// @desc    Create a lead
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Validate required fields
    const { name, email, phone, company } = req.body;
    if (!name || !email || !phone || !company) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide all required fields'
      });
    }

    // Check if email already exists
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        msg: 'Email already exists'
      });
    }

    const lead = new Lead({
      name,
      email,
      phone,
      company,
      status: req.body.status || 'New',
      createdBy: req.user.id,
      notes: req.body.notes || '',
      tags: req.body.tags || []
    });

    await lead.save();
    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (err) {
    console.error('Create lead error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        msg: Object.values(err.errors).map(val => val.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      msg: 'Server error'
    });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update a lead
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        msg: 'Lead not found'
      });
    }

    // Check if email is being updated and if it already exists
    if (req.body.email && req.body.email !== lead.email) {
      const existingLead = await Lead.findOne({ email: req.body.email });
      if (existingLead) {
        return res.status(400).json({
          success: false,
          msg: 'Email already exists'
        });
      }
    }

    // Update lead
    Object.assign(lead, req.body);
    await lead.save();

    res.json({
      success: true,
      data: lead
    });
  } catch (err) {
    console.error('Update lead error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        msg: Object.values(err.errors).map(val => val.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      msg: 'Server error'
    });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        msg: 'Lead not found'
      });
    }

    await lead.deleteOne();
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete lead error:', err);
    res.status(500).json({
      success: false,
      msg: 'Server error'
    });
  }
});

module.exports = router; 