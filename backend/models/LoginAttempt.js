const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  username: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  success: {
    type: Boolean,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  suspicious: {
    type: Boolean,
    default: false,
    index: true
  },
  threatLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  }
});

// Compound indexes for efficient queries
loginAttemptSchema.index({ ipAddress: 1, timestamp: -1 });
loginAttemptSchema.index({ suspicious: 1, timestamp: -1 });
loginAttemptSchema.index({ success: 1, timestamp: -1 });

module.exports = mongoose.model('LoginAttempt', loginAttemptSchema);
