const express = require('express');
const router = express.Router();
const multer = require('multer');
const LoginAttempt = require('../models/LoginAttempt');
const LogAnalyzer = require('../controllers/logAnalyzer');

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get login attempts with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      ipAddress, 
      success, 
      suspicious,
      startDate,
      endDate,
      threatLevel
    } = req.query;

    const query = {};
    
    if (ipAddress) query.ipAddress = ipAddress;
    if (success !== undefined) query.success = success === 'true';
    if (suspicious !== undefined) query.suspicious = suspicious === 'true';
    if (threatLevel) query.threatLevel = threatLevel;
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const loginAttempts = await LoginAttempt.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('ipAddress username timestamp success suspicious country city threatLevel userAgent');

    const total = await LoginAttempt.countDocuments(query);

    res.json({
      loginAttempts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get login attempts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload and analyze log file
router.post('/upload', upload.single('logFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fs = require('fs');
    const logContent = fs.readFileSync(req.file.path, 'utf8');
    const logLines = logContent.split('\n').filter(line => line.trim());

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Analyze logs
    const analysis = await LogAnalyzer.analyzeLogs({
      body: { logs: logLines }
    });

    res.json(analysis);
  } catch (error) {
    console.error('Log upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manual log entry submission
router.post('/submit', async (req, res) => {
  try {
    const { logs } = req.body;
    
    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({ error: 'Invalid log data' });
    }

    const analysis = await LogAnalyzer.analyzeLogs({ body: { logs } });
    res.json(analysis);
  } catch (error) {
    console.error('Log submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get login statistics
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const [
      totalAttempts,
      successfulLogins,
      failedLogins,
      suspiciousAttempts,
      todayAttempts,
      uniqueIPs
    ] = await Promise.all([
      LoginAttempt.countDocuments(),
      LoginAttempt.countDocuments({ success: true }),
      LoginAttempt.countDocuments({ success: false }),
      LoginAttempt.countDocuments({ suspicious: true }),
      LoginAttempt.countDocuments({ timestamp: { $gte: today } }),
      LoginAttempt.distinct('ipAddress')
    ]);

    // Threat level distribution
    const threatDistribution = await LoginAttempt.aggregate([
      { $group: { _id: '$threatLevel', count: { $sum: 1 } } }
    ]);

    // Country distribution
    const countryDistribution = await LoginAttempt.aggregate([
      { $match: { country: { $ne: null } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      stats: {
        totalAttempts,
        successfulLogins,
        failedLogins,
        suspiciousAttempts,
        todayAttempts,
        uniqueIPs: uniqueIPs.length
      },
      threatDistribution,
      countryDistribution
    });
  } catch (error) {
    console.error('Log stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
