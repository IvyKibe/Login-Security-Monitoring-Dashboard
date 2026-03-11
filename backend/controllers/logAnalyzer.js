const LoginAttempt = require('../models/LoginAttempt');
const SecurityAlert = require('../models/SecurityAlert');
const geoip = require('geoip-lite');
const moment = require('moment');

class LogAnalyzer {
  static async analyzeLogs(req, res) {
    try {
      const { logs } = req.body;
      
      if (!logs || !Array.isArray(logs)) {
        return res.status(400).json({ error: 'Invalid log data' });
      }

      const results = [];
      const threats = [];

      for (const logEntry of logs) {
        const analysis = await this.analyzeLogEntry(logEntry);
        results.push(analysis);
        
        if (analysis.threat) {
          threats.push(analysis.threat);
        }
      }

      // Detect patterns across multiple entries
      const patternAnalysis = await this.detectPatterns(logs);
      
      res.json({
        totalEntries: logs.length,
        threats: threats.length,
        results,
        patternAnalysis,
        recommendations: this.generateRecommendations(threats)
      });
    } catch (error) {
      console.error('Log analysis error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async analyzeLogEntry(logEntry) {
    const result = {
      timestamp: new Date(),
      entry: logEntry,
      threat: null,
      severity: 'low'
    };

    // Parse common log formats
    const ipMatch = logEntry.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/);
    const failedMatch = logEntry.match(/LOGIN FAILED|FAILED LOGIN|AUTHENTICATION FAILED|INVALID CREDENTIALS/i);
    const successMatch = logEntry.match(/LOGIN SUCCESS|SUCCESSFUL LOGIN|AUTHENTICATION SUCCESS/i);

    if (ipMatch) {
      const ip = ipMatch[0];
      const geo = geoip.lookup(ip);
      
      result.ip = ip;
      result.geo = geo;
      result.status = failedMatch ? 'failed' : successMatch ? 'success' : 'unknown';

      // Check for threat patterns
      if (failedMatch) {
        result.threat = {
          type: 'failed_login',
          ip,
          message: 'Failed login attempt detected'
        };
        result.severity = 'medium';
      }

      // Store in database
      await this.storeLoginAttempt({
        ipAddress: ip,
        success: successMatch ? true : false,
        timestamp: new Date(),
        country: geo?.country,
        city: geo?.city,
        suspicious: !!failedMatch,
        threatLevel: result.severity
      });
    }

    return result;
  }

  static async detectPatterns(logs) {
    const patterns = [];
    const ipCounts = {};
    const timeWindows = {};

    // Count failed attempts by IP
    logs.forEach(log => {
      const ipMatch = log.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/);
      const failedMatch = log.match(/LOGIN FAILED|FAILED LOGIN|AUTHENTICATION FAILED/i);
      
      if (ipMatch && failedMatch) {
        const ip = ipMatch[0];
        ipCounts[ip] = (ipCounts[ip] || 0) + 1;
      }
    });

    // Detect brute force attacks
    for (const [ip, count] of Object.entries(ipCounts)) {
      if (count >= 5) {
        patterns.push({
          type: 'brute_force',
          ip,
          attempts: count,
          severity: count >= 10 ? 'high' : 'medium',
          message: `Brute force attack detected from ${ip} with ${count} failed attempts`
        });

        // Create security alert
        await this.createSecurityAlert({
          type: 'brute_force',
          severity: count >= 10 ? 'high' : 'medium',
          title: 'Brute Force Attack Detected',
          description: `Multiple failed login attempts from IP ${ip}`,
          ipAddress: ip,
          metadata: { attempts: count }
        });
      }
    }

    return patterns;
  }

  static async storeLoginAttempt(data) {
    try {
      const attempt = new LoginAttempt(data);
      await attempt.save();
    } catch (error) {
      console.error('Error storing login attempt:', error);
    }
  }

  static async createSecurityAlert(data) {
    try {
      const alert = new SecurityAlert(data);
      await alert.save();
    } catch (error) {
      console.error('Error creating security alert:', error);
    }
  }

  static generateRecommendations(threats) {
    const recommendations = [];
    
    if (threats.length > 0) {
      recommendations.push('Enable Multi-Factor Authentication');
      recommendations.push('Implement account lockout after failed attempts');
      
      if (threats.some(t => t.type === 'brute_force')) {
        recommendations.push('Add CAPTCHA to login forms');
        recommendations.push('Implement IP whitelisting for admin access');
      }
      
      recommendations.push('Monitor login activity regularly');
      recommendations.push('Set up automated alert notifications');
    }

    return recommendations;
  }
}

module.exports = LogAnalyzer;
