const jwt = require('jsonwebtoken');

const { secret } = require('../config/jwt');

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' });
  }
  const headerValue = String(header || '').trim();
  const bearerMatch = /^Bearer\s+(.+)$/i.exec(headerValue);
  const token = (bearerMatch ? bearerMatch[1] : headerValue).trim();
  try {
    const legacySecret = process.env.JWT_SECRET_LEGACY || 'super_secret_jwt_key_123456';
    const secretsToTry = [secret, legacySecret].filter((v, i, a) => v && a.indexOf(v) === i);
    let payload;
    let lastErr;

    for (const s of secretsToTry) {
      try {
        payload = jwt.verify(token, s);
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (!payload) {
      throw lastErr || new Error('Invalid token');
    }
    req.user = payload;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    return res.status(401).json({ code: 401, message: 'Invalid token' });
  }
}

module.exports = authMiddleware;

