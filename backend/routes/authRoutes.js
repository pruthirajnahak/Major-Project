const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkeytaskmanager123', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user (FAKE - accepts any details)
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // FAKE AUTH: Accept any user details
    const fakeId = new require('mongodb').ObjectId();
    
    res.status(201).json({
      _id: fakeId,
      name: name || 'Test User',
      email: email || 'test@example.com',
      token: generateToken(fakeId),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (FAKE - accepts any credentials)
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // FAKE AUTH: Accept any credentials
    const fakeId = new require('mongodb').ObjectId();
    
    res.json({
      _id: fakeId,
      name: email?.split('@')[0] || 'Test User',
      email: email || 'test@example.com',
      token: generateToken(fakeId),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

module.exports = router;
