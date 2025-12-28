const jwt = require('jsonwebtoken');

const { secret } = require('../config/jwt');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.warn('Auth Personal: Missing Authorization header');
    return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
  }

  const headerValue = String(authHeader || '').trim();
  const bearerMatch = /^Bearer\s+(.+)$/i.exec(headerValue);
  const token = (bearerMatch ? bearerMatch[1] : headerValue).trim();

  if (!token) {
    console.warn('Auth Personal: Missing token in header');
    return res.status(401).json({ error: 'Unauthorized. Token missing.' });
  }

  // Test environment bypass
  if (process.env.NODE_ENV === 'test' && token === 'test-token') {
    req.user = { id: 'test-user-id' };
    return next();
  }

  try {
    const legacySecret = process.env.JWT_SECRET_LEGACY || 'super_secret_jwt_key_123456';
    const secretsToTry = [secret, legacySecret].filter((v, i, a) => v && a.indexOf(v) === i);
    let decoded;
    let lastErr;

    for (const s of secretsToTry) {
      try {
        decoded = jwt.verify(token, s);
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (!decoded) {
      throw lastErr || new Error('Invalid token');
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth Personal Middleware Error:', err.message, 'Token:', token.substring(0, 10) + '...');
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};

module.exports = auth;
