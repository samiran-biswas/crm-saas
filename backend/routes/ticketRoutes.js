const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// @route   GET /api/tickets
// @desc    Get all tickets
// @access  Private
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .populate('customer', 'firstName lastName email')
      .populate('assignedTo', 'name email');
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/tickets/:id
// @desc    Get ticket by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'firstName lastName email')
      .populate('assignedTo', 'name email');
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/tickets
// @desc    Create a ticket
// @access  Private
router.post('/', async (req, res) => {
  try {
    const newTicket = new Ticket({
      ...req.body,
      createdBy: req.user.id // Assuming auth middleware sets req.user
    });
    const ticket = await newTicket.save();
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/tickets/:id
// @desc    Update ticket
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/tickets/:id
// @desc    Delete ticket
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    await ticket.remove();
    res.json({ msg: 'Ticket removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 