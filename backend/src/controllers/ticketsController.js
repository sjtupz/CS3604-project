const { queryTickets } = require('../services/ticketsService');

async function getTickets(req, res, next) {
  try {
    const result = await queryTickets(req.query);
    
    // Normalize result to expected structure { data: { items: [] } }
    let items = [];
    let extraData = {};

    if (Array.isArray(result)) {
      items = result;
    } else if (result && typeof result === 'object') {
      if (result.outbound_tickets) {
        items = result.outbound_tickets;
      }
      // Preserve other fields like return_tickets
      extraData = { ...result };
      delete extraData.outbound_tickets;
    }

    console.log(`[DEBUG] API Response: Returning ${items.length} items`);

    return res.json({
      code: 200,
      data: {
        items: items,
        ...extraData
      },
      message: 'Success'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTickets };

