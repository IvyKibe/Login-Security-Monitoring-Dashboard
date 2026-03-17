const express = require('express');
const router = express.Router();
const SuspiciousActivity = require('../models/SuspiciousActivity');
const { authenticateToken } = require('./auth');

// Get all suspicious activities for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, severity, status, activityType } = req.query;
    
    const query = { userId: req.user.userId };
    
    if (severity) query.severity = severity;
    if (status) query.status = status;
    if (activityType) query.activityType = activityType;
    
    const activities = await SuspiciousActivity.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'username email')
      .populate('assignedTo', 'username')
      .populate('comments.user', 'username');
    
    const total = await SuspiciousActivity.countDocuments(query);
    
    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get suspicious activities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get public suspicious activities (for community viewing)
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 20, severity, activityType, tags } = req.query;
    
    const query = {};
    
    if (severity) query.severity = severity;
    if (activityType) query.activityType = activityType;
    if (tags) query.tags = { $in: tags.split(',') };
    
    const activities = await SuspiciousActivity.find(query)
      .sort({ timestamp: -1, upvotes: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'username organization')
      .select('-ipAddress -evidence -comments');
    
    const total = await SuspiciousActivity.countDocuments(query);
    
    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get public activities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new suspicious activity report
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      activityType,
      severity,
      title,
      description,
      ipAddress,
      userAgent,
      location,
      evidence,
      tags
    } = req.body;
    
    // Validate required fields
    if (!activityType || !severity || !title || !description) {
      return res.status(400).json({ 
        error: 'Activity type, severity, title, and description are required' 
      });
    }
    
    const activity = new SuspiciousActivity({
      userId: req.user.userId,
      activityType,
      severity,
      title,
      description,
      ipAddress,
      userAgent,
      location,
      evidence: evidence || {},
      tags: tags || []
    });
    
    await activity.save();
    
    // Populate user info for response
    await activity.populate('userId', 'username email organization');
    
    res.status(201).json({
      message: 'Suspicious activity reported successfully',
      activity
    });
  } catch (error) {
    console.error('Create suspicious activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single suspicious activity
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const activity = await SuspiciousActivity.findById(req.params.id)
      .populate('userId', 'username email organization')
      .populate('assignedTo', 'username')
      .populate('comments.user', 'username');
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    // Check if user owns the activity or is admin
    if (activity.userId._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(activity);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update suspicious activity status (admin only)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { status, assignedTo, notes, actions } = req.body;
    
    const activity = await SuspiciousActivity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    activity.status = status;
    if (assignedTo) activity.assignedTo = assignedTo;
    
    if (status === 'resolved' || status === 'false_positive') {
      activity.resolution = {
        resolvedAt: new Date(),
        resolvedBy: req.user.userId,
        notes: notes || '',
        actions: actions || []
      };
    }
    
    await activity.save();
    await activity.populate('assignedTo', 'username');
    
    res.json({
      message: 'Activity status updated successfully',
      activity
    });
  } catch (error) {
    console.error('Update activity status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add comment to activity
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    
    const activity = await SuspiciousActivity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    activity.comments.push({
      user: req.user.userId,
      text,
      timestamp: new Date()
    });
    
    await activity.save();
    await activity.populate('comments.user', 'username');
    
    res.json({
      message: 'Comment added successfully',
      comment: activity.comments[activity.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upvote activity
router.post('/:id/upvote', authenticateToken, async (req, res) => {
  try {
    const activity = await SuspiciousActivity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    activity.upvotes += 1;
    await activity.save();
    
    res.json({
      message: 'Activity upvoted successfully',
      upvotes: activity.upvotes
    });
  } catch (error) {
    console.error('Upvote activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const [
      totalReports,
      pendingReports,
      resolvedReports,
      criticalReports,
      reportsByType,
      reportsBySeverity
    ] = await Promise.all([
      SuspiciousActivity.countDocuments({ userId }),
      SuspiciousActivity.countDocuments({ userId, status: 'pending' }),
      SuspiciousActivity.countDocuments({ userId, status: 'resolved' }),
      SuspiciousActivity.countDocuments({ userId, severity: 'critical' }),
      SuspiciousActivity.aggregate([
        { $match: { userId } },
        { $group: { _id: '$activityType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      SuspiciousActivity.aggregate([
        { $match: { userId } },
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ])
    ]);
    
    res.json({
      stats: {
        totalReports,
        pendingReports,
        resolvedReports,
        criticalReports
      },
      reportsByType,
      reportsBySeverity
    });
  } catch (error) {
    console.error('Activity stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
