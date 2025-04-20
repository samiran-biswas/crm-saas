const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  meetingType: {
    type: String,
    enum: ['in_person', 'virtual', 'phone'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['accepted', 'declined', 'tentative', 'pending'],
      default: 'pending'
    },
    responseTime: Date
  }],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  agenda: [{
    topic: String,
    duration: Number, // in minutes
    presenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reminders: [{
    time: Date,
    type: {
      type: String,
      enum: ['email', 'notification', 'both']
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],
  calendarEventId: {
    type: String // For syncing with external calendars
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
meetingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting; 