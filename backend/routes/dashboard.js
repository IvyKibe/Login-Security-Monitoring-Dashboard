const express = require('express');
const router = express.Router();
const LoginAttempt = require('../models/LoginAttempt');
const SecurityAlert = require('../models/SecurityAlert');
const moment = require('moment');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Login attempts today
    const loginAttemptsToday = await LoginAttempt.countDocuments({
      timestamp: { $gte: today }
    });

    // Failed logins today
    const failedLoginsToday = await LoginAttempt.countDocuments({
      timestamp: { $gte: today },
      success: false
    });

    // Suspicious IPs today
    const suspiciousIPsToday = await LoginAttempt.distinct('ipAddress', {
      timestamp: { $gte: today },
      suspicious: true
    });

    // Active brute force alerts
    const bruteForceAlerts = await SecurityAlert.countDocuments({
      type: 'brute_force',
      resolved: false,
      timestamp: { $gte: today }
    });

    // Recent activity (last 24 hours)
    const recentActivity = await LoginAttempt.find({
      timestamp: { $gte: yesterday }
    })
    .sort({ timestamp: -1 })
    .limit(50)
    .select('ipAddress timestamp success suspicious country');

    // Threat distribution
    const threatDistribution = await LoginAttempt.aggregate([
      { $match: { timestamp: { $gte: today } } },
      { $group: { _id: '$threatLevel', count: { $sum: 1 } } }
    ]);

    // Geographic distribution
    const geoDistribution = await LoginAttempt.aggregate([
      { $match: { timestamp: { $gte: today }, country: { $ne: null } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      stats: {
        loginAttemptsToday,
        failedLoginsToday,
        suspiciousIPsToday: suspiciousIPsToday.length,
        bruteForceAlerts
      },
      recentActivity,
      threatDistribution,
      geoDistribution,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get login activity timeline
router.get('/timeline', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const timeline = await LoginAttempt.aggregate([
      { $match: { timestamp: { $gte: startTime } } },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
            hour: { $hour: '$timestamp' }
          },
          total: { $sum: 1 },
          failed: { $sum: { $cond: ['$success', 0, 1] } },
          suspicious: { $sum: { $cond: ['$suspicious', 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
    ]);

    res.json(timeline);
  } catch (error) {
    console.error('Timeline error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get top suspicious IPs
router.get('/suspicious-ips', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const suspiciousIPs = await LoginAttempt.aggregate([
      { $match: { timestamp: { $gte: today }, suspicious: true } },
      {
        $group: {
          _id: '$ipAddress',
          attempts: { $sum: 1 },
          countries: { $addToSet: '$country' },
          lastSeen: { $max: '$timestamp' }
        }
      },
      { $sort: { attempts: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json(suspiciousIPs);
  } catch (error) {
    console.error('Suspicious IPs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
