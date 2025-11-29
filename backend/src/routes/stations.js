const express = require('express');
const router = express.Router();
const { getAllStations } = require('../controllers/stationController');

router.get('/', getAllStations);

module.exports = router;