const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password').populate('role');

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to authorize based on role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!req.user.role) {
      return res.status(403).json({ message: 'User has no role assigned' });
    }

    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role.name} is not authorized to access this route` 
      });
    }

    next();
  };
};

// Middleware to check specific permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!req.user.role) {
      return res.status(403).json({ message: 'User has no role assigned' });
    }

    if (!req.user.role.permissions.includes(permission)) {
      return res.status(403).json({ 
        message: `User does not have permission to ${permission}` 
      });
    }

    next();
  };
};

module.exports = {
  auth,
  authorizeRole,
  checkPermission
}; 