const { getSession } = require('../utils/sessionStore');

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' });
  }
  const token = header.replace(/^Bearer\s+/i, '');
  
  const user = getSession(token);
  if (user) {
    req.user = user;
    next();
  } else {
    return res.status(401).json({ code: 401, message: 'Invalid token' });
  }
}

module.exports = authMiddleware;

