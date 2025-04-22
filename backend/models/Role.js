const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Admin', 'Superadmin', 'Employee'],
    required: true,
    unique: true
  },
  permissions: {
    type: Map,
    of: Boolean,
    default: {}
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  isSuperadmin: {
    type: Boolean,
    default: false,
    required: function() {
      return this.name === 'Superadmin';  // Only Superadmin can have this field
    }
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

// Ensure only one Superadmin
roleSchema.pre('save', async function(next) {
  if (this.isSuperadmin) {
    const superAdminCount = await this.constructor.countDocuments({ 
      isSuperadmin: true, 
      organization: this.organization 
    });
    if (superAdminCount > 0) {
      throw new Error('Only one Superadmin is allowed per organization');
    }
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Role', roleSchema);
