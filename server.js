const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const path = require('path');
const {
  getActivities,
  addActivity,
  getRandomActivity,
  deleteActivity,
  getPasswordHash,
  updatePassword
} = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Store active sessions (in production, use Redis or similar)
const sessions = new Map();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Authentication middleware
function requireAuth(req, res, next) {
  const sessionId = req.cookies.session_id;
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}

// Routes
// Login endpoint
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }
  
  const authData = getPasswordHash.get();
  const isValid = bcrypt.compareSync(password, authData.password_hash);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  
  // Create session
  const sessionId = crypto.randomBytes(32).toString('hex');
  sessions.set(sessionId, { createdAt: Date.now() });
  
  // Set cookie (expires in 1 month / 30 days)
  res.cookie('session_id', sessionId, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'strict'
  });
  
  res.json({ success: true });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  const sessionId = req.cookies.session_id;
  if (sessionId) {
    sessions.delete(sessionId);
  }
  res.clearCookie('session_id');
  res.json({ success: true });
});

// Check authentication status
app.get('/api/auth/check', (req, res) => {
  const sessionId = req.cookies.session_id;
  const isAuthenticated = sessionId && sessions.has(sessionId);
  res.json({ authenticated: isAuthenticated });
});

// Get all activities (protected)
app.get('/api/activities', requireAuth, (req, res) => {
  try {
    const activities = getActivities.all();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Add new activity (protected)
app.post('/api/activities', requireAuth, (req, res) => {
  const { idea } = req.body;
  
  if (!idea || idea.trim() === '') {
    return res.status(400).json({ error: 'Idea is required' });
  }
  
  try {
    const result = addActivity.run(idea.trim());
    res.json({ id: result.lastInsertRowid, idea: idea.trim() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add activity' });
  }
});

// Get random activity (protected)
app.get('/api/activities/random', requireAuth, (req, res) => {
  try {
    const activity = getRandomActivity.get();
    if (!activity) {
      return res.status(404).json({ error: 'No activities found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch random activity' });
  }
});

// Delete activity (protected)
app.delete('/api/activities/:id', requireAuth, (req, res) => {
  try {
    deleteActivity.run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// Change password (protected)
app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const { newPassword } = req.body;
  
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters' });
  }
  
  try {
    const hash = bcrypt.hashSync(newPassword, 10);
    updatePassword.run(hash);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Default password is "password" - please change it after first login!');
});
