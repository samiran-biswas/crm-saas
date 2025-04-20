const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  quotationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  items: [{
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
    default: 'DRAFT',
  },
  validUntil: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
  termsAndConditions: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sentAt: {
    type: Date,
  },
  acceptedAt: {
    type: Date,
  },
  rejectedAt: {
    type: Date,
  },
  convertedToInvoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
  },
}, {
  timestamps: true,
});

// Pre-save middleware to calculate totals
quotationSchema.pre('save', function(next) {
  // Calculate item totals
  this.items.forEach(item => {
    item.total = item.quantity * item.unitPrice;
  });

  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);

  // Calculate total
  this.total = this.subtotal + this.tax - this.discount;

  next();
});

// Method to check if quotation is expired
quotationSchema.methods.isExpired = function() {
  return this.validUntil < new Date();
};

// Method to check if quotation can be converted to invoice
quotationSchema.methods.canConvertToInvoice = function() {
  return this.status === 'ACCEPTED' && !this.convertedToInvoice;
};

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation; 