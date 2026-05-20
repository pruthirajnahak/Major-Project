const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeytaskmanager123');

      // Try to get user from database, but allow fake/non-existent users for demo
      req.user = await User.findById(decoded.id).select('-password');

      // If user not found in DB, create fake user object for demo purposes
      if (!req.user) {
        req.user = {
          _id: decoded.id,
          name: 'Demo User',
          email: 'demo@example.com',
        };
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
