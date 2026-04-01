const mongoose = require('mongoose');

const suspiciousActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    required: true,
    enum: [
      'brute_force',
      'sql_injection',
      'xss_attempt',
      'ddos_attack',
      'phishing',
      'malware',
      'unauthorized_access',
      'data_breach',
      'suspicious_login',
      'anomaly_detection',
      'other'
    ]
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  location: {
    country: String,
    city: String,
    latitude: Number,
    longitude: Number
  },
  evidence: {
    logs: [String],
    screenshots: [String],
    files: [String],
    metadata: mongoose.Schema.Types.Mixed
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'investigating', 'resolved', 'false_positive']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    actions: [String]
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
suspiciousActivitySchema.index({ userId: 1, timestamp: -1 });
suspiciousActivitySchema.index({ severity: 1, status: 1 });
suspiciousActivitySchema.index({ activityType: 1 });
suspiciousActivitySchema.index({ ipAddress: 1 });
suspiciousActivitySchema.index({ tags: 1 });
suspiciousActivitySchema.index({ upvotes: -1 });
suspiciousActivitySchema.index({ timestamp: -1 });

// Update lastUpdated timestamp on save
suspiciousActivitySchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to get statistics
suspiciousActivitySchema.statics.getStats = async function(userId = null) {
  const matchQuery = userId ? { userId } : {};
  
  const [
    totalReports,
    pendingReports,
    investigatingReports,
    resolvedReports,
    falsePositiveReports,
    criticalReports,
    highReports,
    reportsByType,
    reportsBySeverity,
    recentReports
  ] = await Promise.all([
    this.countDocuments(matchQuery),
    this.countDocuments({ ...matchQuery, status: 'pending' }),
    this.countDocuments({ ...matchQuery, status: 'investigating' }),
    this.countDocuments({ ...matchQuery, status: 'resolved' }),
    this.countDocuments({ ...matchQuery, status: 'false_positive' }),
    this.countDocuments({ ...matchQuery, severity: 'critical' }),
    this.countDocuments({ ...matchQuery, severity: 'high' }),
    this.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$activityType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    this.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]),
    this.find(matchQuery)
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'username email')
      .select('title severity status timestamp upvotes')
  ]);

  return {
    overview: {
      totalReports,
      pendingReports,
      investigatingReports,
      resolvedReports,
      falsePositiveReports,
      criticalReports,
      highReports
    },
    reportsByType,
    reportsBySeverity,
    recentReports
  };
};

// Instance method to add comment
suspiciousActivitySchema.methods.addComment = function(userId, text) {
  this.comments.push({
    user: userId,
    text,
    timestamp: new Date()
  });
  return this.save();
};

// Instance method to upvote
suspiciousActivitySchema.methods.upvote = function() {
  this.upvotes += 1;
  return this.save();
};

// Instance method to update status
suspiciousActivitySchema.methods.updateStatus = function(status, assignedTo, notes, actions, resolvedBy) {
  this.status = status;
  if (assignedTo) this.assignedTo = assignedTo;
  
  if (status === 'resolved' || status === 'false_positive') {
    this.resolution = {
      resolvedAt: new Date(),
      resolvedBy,
      notes: notes || '',
      actions: actions || []
    };
  }
  
  return this.save();
};

module.exports = mongoose.model('SuspiciousActivity', suspiciousActivitySchema);
