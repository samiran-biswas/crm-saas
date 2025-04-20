const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subscription name'],
    enum: ['free', 'basic', 'pro', 'enterprise']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  features: [{
    name: String,
    description: String,
    enabled: Boolean
  }],
  maxUsers: {
    type: Number,
    required: [true, 'Please add maximum number of users']
  },
  maxStorage: {
    type: Number,
    required: [true, 'Please add maximum storage in GB']
  },
  maxLeads: {
    type: Number,
    required: [true, 'Please add maximum number of leads']
  },
  maxCustomers: {
    type: Number,
    required: [true, 'Please add maximum number of customers']
  },
  maxTickets: {
    type: Number,
    required: [true, 'Please add maximum number of tickets']
  },
  integrations: {
    slack: Boolean,
    zoho: Boolean,
    googleCalendar: Boolean,
    outlook: Boolean,
    email: Boolean
  },
  analytics: {
    basic: Boolean,
    advanced: Boolean,
    realTime: Boolean
  },
  automation: {
    basic: Boolean,
    advanced: Boolean,
    custom: Boolean
  },
  support: {
    email: Boolean,
    chat: Boolean,
    phone: Boolean,
    priority: Boolean
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

// Update the updatedAt field before saving
SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Subscription', SubscriptionSchema); 