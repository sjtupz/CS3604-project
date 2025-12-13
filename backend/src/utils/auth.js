const jwt = require('jsonwebtoken');

function generateToken(payload, options = {}) {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_123456';
  const signOptions = { expiresIn: '1h', ...options };
  return jwt.sign(payload, secret, signOptions);
}

module.exports = { generateToken };

