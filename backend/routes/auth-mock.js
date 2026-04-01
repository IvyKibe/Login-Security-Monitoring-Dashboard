const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock user data
const mockUsers = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@example.com' },
  { id: 2, username: 'user', password: 'user123', role: 'user', email: 'user@example.com' }
];

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = mockUsers.find(u => u.username === username && u.password === password);
  
  if (user) {
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      'demo-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Signup endpoint
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.username === username || u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  // Create new user (mock)
  const newUser = {
    id: mockUsers.length + 1,
    username,
    email,
    password,
    role: 'user'
  };
  
  mockUsers.push(newUser);
  
  const token = jwt.sign(
    { userId: newUser.id, username: newUser.username, role: newUser.role },
    'demo-secret',
    { expiresIn: '24h' }
  );
  
  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// Verify endpoint
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'demo-secret');
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout endpoint
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

  jwt.verify(token, 'demo-secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = router;
module.exports.authenticateToken = authenticateToken;
