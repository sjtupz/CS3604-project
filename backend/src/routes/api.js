const express = require('express');
const router = express.Router();
const { findAllStations, findTrains } = require('../db/operations');

// GET /api/stations
router.get('/stations', async (req, res) => {
  // TODO: 实现获取所有站点的逻辑
  res.status(501).send({ error: 'Not Implemented' });
});

// GET /api/trains
router.get('/trains', async (req, res) => {
  // TODO: 实现查询车次的逻辑
  res.status(501).send({ error: 'Not Implemented' });
});

module.exports = router;