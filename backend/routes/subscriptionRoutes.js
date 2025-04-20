const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// @route   GET /api/subscriptions
// @desc    Get all subscriptions
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ price: 1 });
    res.json(subscriptions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/subscriptions/:id
// @desc    Get subscription by ID
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Subscription not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/subscriptions
// @desc    Create a subscription
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const newSubscription = new Subscription(req.body);
    const subscription = await newSubscription.save();
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/subscriptions/:id
// @desc    Update subscription
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/subscriptions/:id
// @desc    Delete subscription
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription not found' });
    }
    await subscription.remove();
    res.json({ msg: 'Subscription removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 