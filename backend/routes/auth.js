const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Simple authentication for demo purposes
// In production, use proper user management system

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Demo credentials (in production, use database)
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        { username, role: 'admin' },
        process.env.JWT_SECRET || 'demo-secret',
        { expiresIn: '24h' }
      );
      
      res.json({
        message: 'Login successful',
        token,
        user: { username, role: 'admin' }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'demo-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

router.get('/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user, valid: true });
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
