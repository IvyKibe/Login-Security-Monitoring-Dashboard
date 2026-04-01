const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Running in demo mode without MongoDB
console.log('Log Sentinel Backend running in demo mode');

// Routes (Mock versions without database)
app.use('/api/auth', require('./routes/auth-mock'));

// Mock data endpoints
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalLogins: 15234,
    failedAttempts: 234,
    blockedIPs: 45,
    activeThreats: 8,
    recentActivity: [
      { time: '2024-04-01T09:00:00Z', event: 'Login attempt', status: 'success', ip: '192.168.1.1' },
      { time: '2024-04-01T08:55:00Z', event: 'Failed login', status: 'failed', ip: '192.168.1.2' },
      { time: '2024-04-01T08:50:00Z', event: 'Brute force detected', status: 'threat', ip: '192.168.1.3' }
    ]
  });
});

app.get('/api/alerts', (req, res) => {
  res.json([
    {
      id: 1,
      type: 'brute_force',
      severity: 'high',
      message: 'Brute force attack detected from 192.168.1.100',
      timestamp: '2024-04-01T08:45:00Z',
      status: 'active'
    },
    {
      id: 2,
      type: 'suspicious_ip',
      severity: 'medium',
      message: 'Suspicious activity from 192.168.1.101',
      timestamp: '2024-04-01T08:30:00Z',
      status: 'investigating'
    }
  ]);
});

app.get('/api/suspicious', (req, res) => {
  res.json({
    activities: [
      {
        _id: '1',
        activityType: 'brute_force',
        severity: 'high',
        title: 'Brute Force Attack Detected',
        description: 'Multiple failed login attempts detected',
        ipAddress: '192.168.1.100',
        timestamp: '2024-04-01T08:45:00Z',
        status: 'pending',
        upvotes: 5,
        userId: { username: 'admin' }
      }
    ]
  });
});

app.get('/api/suspicious/public', (req, res) => {
  res.json({
    activities: [
      {
        _id: '1',
        activityType: 'brute_force',
        severity: 'high',
        title: 'Brute Force Attack Detected',
        description: 'Multiple failed login attempts detected',
        ipAddress: '192.168.1.100',
        timestamp: '2024-04-01T08:45:00Z',
        status: 'pending',
        upvotes: 5,
        userId: { username: 'admin' }
      }
    ]
  });
});

app.post('/api/suspicious', (req, res) => {
  res.status(201).json({
    message: 'Suspicious activity reported successfully',
    activity: {
      _id: Date.now().toString(),
      ...req.body,
      timestamp: new Date().toISOString(),
      status: 'pending',
      upvotes: 0
    }
  });
});

// Log analyzer endpoint
app.post('/api/analyze', (req, res) => {
  const { logs } = req.body;
  
  // Mock analysis
  const threats = [];
  const ipCounts = {};
  
  logs.forEach(log => {
    const ipMatch = log.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/);
    const failedMatch = log.match(/FAILED/i);
    
    if (ipMatch && failedMatch) {
      const ip = ipMatch[0];
      ipCounts[ip] = (ipCounts[ip] || 0) + 1;
    }
  });
  
  for (const [ip, count] of Object.entries(ipCounts)) {
    if (count >= 3) {
      threats.push({
        type: 'brute_force',
        ip,
        attempts: count,
        severity: count >= 5 ? 'high' : 'medium',
        message: `Brute force attack detected from ${ip} with ${count} failed attempts`
      });
    }
  }
  
  res.json({
    totalEntries: logs.length,
    threats: threats.length,
    threats,
    summary: {
      totalIPs: Object.keys(ipCounts).length,
      failedAttempts: Object.values(ipCounts).reduce((a, b) => a + b, 0),
      suspiciousIPs: Object.keys(ipCounts).filter(ip => ipCounts[ip] >= 3).length
    }
  });
});


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Log Sentinel Backend running on port ${PORT}`);
});
