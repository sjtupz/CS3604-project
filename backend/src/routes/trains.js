const express = require('express');
const router = express.Router();
const { getTrains } = require('../controllers/trainController');

router.get('/', getTrains);

module.exports = router;