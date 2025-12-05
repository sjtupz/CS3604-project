const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
  }

  // Support both "Bearer <token>" and just "<token>" for backward compatibility if needed
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Token missing.' });
  }

  // Test environment bypass
  if (process.env.NODE_ENV === 'test' && token === 'test-token') {
    req.user = { id: 'test-user-id' };
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_123456';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};

module.exports = auth;
