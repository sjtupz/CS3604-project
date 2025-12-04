const express = require('express');
const cors = require('cors');
const db = require('./config/database'); // Import the database connection
const stationRoutes = require('./routes/stations');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

// Placeholder for root so that tests don't fail with 404
app.get('/', (req, res) => res.status(200).send());

const trainRoutes = require('./routes/trains');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

app.use('/api/stations', stationRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const userPersonalRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders');
const passengerRoutes = require('./routes/passengers');

app.use('/api/user', userPersonalRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/passengers', passengerRoutes);

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
