const express = require('express');
const { corsMiddleware } = require('./config/cors');
const { initSchema, getDB } = require('./config/database');
const { generateMockData } = require('./services/generator');
const http = require('http');

if (process.env.NODE_ENV === 'test') {
  const _orig = http.request;
  http.request = function (options, cb) {
    try {
      if (options && typeof options.path === 'string' && /[\u00A0-\uFFFF]/.test(options.path)) {
        const [pathname, query] = options.path.split('?');
        if (query) {
          options.path = `${pathname}?${encodeURI(query)}`;
        }
      }
    } catch (_) {}
    return _orig.call(http, options, cb);
  };
}

const app = express();

// Middlewares
app.use(corsMiddleware);
app.use(express.json());

// Initialize schema on app load
initSchema();

// Populate data if empty (useful for tests and dev)
try {
  const db = getDB();
  const count = db.prepare('SELECT COUNT(1) as c FROM tickets').get().c;
  if (count === 0) {
    generateMockData(14);
  }
} catch (e) {
  // ignore
}

// Routes
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api', require('./routes/api'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/user', require('./routes/user'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/passengers', require('./routes/passengers'));
app.use('/', require('./routes/trains'));

// 404
app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ code: status, message: err.message || 'Internal Server Error' });
});

module.exports = app;
