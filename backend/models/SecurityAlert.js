const mongoose = require('mongoose');

const securityAlertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['brute_force', 'suspicious_ip', 'multiple_failures', 'anomalous_pattern'],
    required: true,
    index: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: false,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  resolved: {
    type: Boolean,
    default: false,
    index: true
  },
  metadata: {
    attempts: Number,
    timeWindow: Number,
    userAgent: String,
    country: String,
    username: String
  },
  actions: [{
    type: String,
    enum: ['block_ip', 'notify_admin', 'require_captcha', 'lock_account']
  }]
});

securityAlertSchema.index({ resolved: 1, timestamp: -1 });
securityAlertSchema.index({ severity: 1, timestamp: -1 });

module.exports = mongoose.model('SecurityAlert', securityAlertSchema);
