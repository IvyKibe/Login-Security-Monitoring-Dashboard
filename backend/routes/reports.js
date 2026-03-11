const express = require('express');
const router = express.Router();
const LoginAttempt = require('../models/LoginAttempt');
const SecurityAlert = require('../models/SecurityAlert');
const moment = require('moment');

// Generate security report
router.get('/security', async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate;
    switch (period) {
      case '24h':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    const endDate = new Date();

    // Get data for the period
    const [
      totalAttempts,
      successfulLogins,
      failedLogins,
      suspiciousAttempts,
      uniqueIPs,
      alerts,
      criticalAlerts
    ] = await Promise.all([
      LoginAttempt.countDocuments({ timestamp: { $gte: startDate, $lte: endDate } }),
      LoginAttempt.countDocuments({ timestamp: { $gte: startDate, $lte: endDate }, success: true }),
      LoginAttempt.countDocuments({ timestamp: { $gte: startDate, $lte: endDate }, success: false }),
      LoginAttempt.countDocuments({ timestamp: { $gte: startDate, $lte: endDate }, suspicious: true }),
      LoginAttempt.distinct('ipAddress', { timestamp: { $gte: startDate, $lte: endDate } }),
      SecurityAlert.countDocuments({ timestamp: { $gte: startDate, $lte: endDate } }),
      SecurityAlert.countDocuments({ timestamp: { $gte: startDate, $lte: endDate }, severity: 'critical' })
    ]);

    // Top attacking IPs
    const topIPs = await LoginAttempt.aggregate([
      { $match: { timestamp: { $gte: startDate, $lte: endDate }, suspicious: true } },
      { $group: { _id: '$ipAddress', attempts: { $sum: 1 }, countries: { $addToSet: '$country' } } },
      { $sort: { attempts: -1 } },
      { $limit: 10 }
    ]);

    // Attack patterns over time
    const attackTimeline = await LoginAttempt.aggregate([
      { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          total: { $sum: 1 },
          failed: { $sum: { $cond: ['$success', 0, 1] } },
          suspicious: { $sum: { $cond: ['$suspicious', 1, 0] } }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Geographic distribution
    const geoAttacks = await LoginAttempt.aggregate([
      { $match: { timestamp: { $gte: startDate, $lte: endDate }, country: { $ne: null } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    // Calculate risk score
    const failureRate = totalAttempts > 0 ? (failedLogins / totalAttempts) * 100 : 0;
    const suspiciousRate = totalAttempts > 0 ? (suspiciousAttempts / totalAttempts) * 100 : 0;
    const alertRate = totalAttempts > 0 ? (alerts / totalAttempts) * 100 : 0;
    
    let riskLevel = 'Low';
    let riskScore = 0;
    
    if (failureRate > 30 || suspiciousRate > 20 || criticalAlerts > 0) {
      riskLevel = 'Critical';
      riskScore = 85 + Math.random() * 15;
    } else if (failureRate > 20 || suspiciousRate > 10 || alerts > 10) {
      riskLevel = 'High';
      riskScore = 65 + Math.random() * 20;
    } else if (failureRate > 10 || suspiciousRate > 5) {
      riskLevel = 'Medium';
      riskScore = 40 + Math.random() * 25;
    } else {
      riskScore = Math.random() * 40;
    }

    // Generate recommendations
    const recommendations = generateRecommendations({
      failureRate,
      suspiciousRate,
      alertRate,
      criticalAlerts,
      topIPs,
      uniqueIPs: uniqueIPs.length
    });

    res.json({
      period,
      generatedAt: new Date(),
      summary: {
        totalAttempts,
        successfulLogins,
        failedLogins,
        suspiciousAttempts,
        uniqueIPs: uniqueIPs.length,
        alerts,
        criticalAlerts,
        failureRate: Math.round(failureRate * 100) / 100,
        suspiciousRate: Math.round(suspiciousRate * 100) / 100
      },
      riskAssessment: {
        level: riskLevel,
        score: Math.round(riskScore),
        factors: {
          failureRate: Math.round(failureRate * 100) / 100,
          suspiciousRate: Math.round(suspiciousRate * 100) / 100,
          criticalAlerts
        }
      },
      topIPs,
      attackTimeline,
      geoAttacks,
      recommendations
    });
  } catch (error) {
    console.error('Security report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function generateRecommendations(data) {
  const recommendations = [];
  
  if (data.failureRate > 30) {
    recommendations.push({
      priority: 'high',
      category: 'authentication',
      title: 'Implement Account Lockout',
      description: 'High failure rate detected. Implement account lockout after multiple failed attempts.'
    });
  }
  
  if (data.suspiciousRate > 15) {
    recommendations.push({
      priority: 'high',
      category: 'security',
      title: 'Add CAPTCHA Protection',
      description: 'High suspicious activity detected. Add CAPTCHA to prevent automated attacks.'
    });
  }
  
  if (data.criticalAlerts > 0) {
    recommendations.push({
      priority: 'critical',
      category: 'monitoring',
      title: 'Immediate Security Review Required',
      description: 'Critical alerts detected. Review security logs and implement immediate countermeasures.'
    });
  }
  
  if (data.uniqueIPs > 1000) {
    recommendations.push({
      priority: 'medium',
      category: 'access',
      title: 'Implement IP Whitelisting',
      description: 'Large number of unique IPs detected. Consider implementing IP whitelisting for admin access.'
    });
  }
  
  recommendations.push({
    priority: 'low',
    category: 'general',
    title: 'Enable Multi-Factor Authentication',
    description: 'MFA significantly reduces the risk of successful credential attacks.'
  });
  
  recommendations.push({
    priority: 'low',
    category: 'monitoring',
    title: 'Regular Security Audits',
    description: 'Schedule regular security audits to identify and address vulnerabilities.'
  });
  
  return recommendations;
}

module.exports = router;
