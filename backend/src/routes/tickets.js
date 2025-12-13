const express = require('express');
const { getTickets } = require('../controllers/ticketsController');
const router = express.Router();

router.get('/', getTickets);

module.exports = router;
