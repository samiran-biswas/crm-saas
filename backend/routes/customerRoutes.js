const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// @route   GET /api/customers
// @desc    Get all customers
// @access  Private
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/customers/:id
// @desc    Get customer by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/customers
// @desc    Create a customer
// @access  Private
router.post('/', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    const customer = await newCustomer.save();
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    await customer.remove();
    res.json({ msg: 'Customer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 