const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' });
  }
  const token = header.replace(/^Bearer\s+/i, '');
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ code: 401, message: 'Invalid token' });
  }
}

module.exports = authMiddleware;

