const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  entity: {
    type: String // e.g., 'User', 'Lead', 'Contact'
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: Object // Store any custom info like changed fields, IP, etc.
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
