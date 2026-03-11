const express = require('express');
const router = express.Router();
const SecurityAlert = require('../models/SecurityAlert');

// Get all alerts with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      severity, 
      type, 
      resolved = false,
      startDate,
      endDate 
    } = req.query;

    const query = {};
    
    if (severity) query.severity = severity;
    if (type) query.type = type;
    if (resolved !== undefined) query.resolved = resolved === 'true';
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const alerts = await SecurityAlert.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('type severity title description ipAddress timestamp resolved metadata');

    const total = await SecurityAlert.countDocuments(query);

    res.json({
      alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get alert statistics
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const [
      totalAlerts,
      criticalAlerts,
      unresolvedAlerts,
      todayAlerts,
      weekAlerts
    ] = await Promise.all([
      SecurityAlert.countDocuments(),
      SecurityAlert.countDocuments({ severity: 'critical' }),
      SecurityAlert.countDocuments({ resolved: false }),
      SecurityAlert.countDocuments({ timestamp: { $gte: today } }),
      SecurityAlert.countDocuments({ timestamp: { $gte: lastWeek } })
    ]);

    // Alert distribution by type
    const typeDistribution = await SecurityAlert.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Alert distribution by severity
    const severityDistribution = await SecurityAlert.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    res.json({
      stats: {
        totalAlerts,
        criticalAlerts,
        unresolvedAlerts,
        todayAlerts,
        weekAlerts
      },
      typeDistribution,
      severityDistribution
    });
  } catch (error) {
    console.error('Alert stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark alert as resolved
router.patch('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const alert = await SecurityAlert.findByIdAndUpdate(
      id,
      { 
        resolved: true,
        resolvedAt: new Date(),
        resolvedNotes: notes
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new alert
router.post('/', async (req, res) => {
  try {
    const alert = new SecurityAlert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
