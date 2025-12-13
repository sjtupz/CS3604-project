const { queryTickets } = require('../services/ticketsService');

async function getTickets(req, res, next) {
  try {
    const data = await queryTickets(req.query);
    return res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getTickets };

