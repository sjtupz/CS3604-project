const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

function generateToken(payload, options = {}) {
  const signOptions = { expiresIn: '1h', ...options };
  return jwt.sign(payload, secret, signOptions);
}

module.exports = { generateToken };

