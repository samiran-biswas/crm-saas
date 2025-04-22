const jwt = require('jsonwebtoken');

// Generate a JWT token
const generateToken = (payload, expiresIn = '1h') => {
  const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Use an environment variable for security
  return jwt.sign(payload, secretKey, { expiresIn });
};

module.exports = { generateToken };
