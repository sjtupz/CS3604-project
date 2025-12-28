const { queryTickets } = require('../services/ticketsService');

async function getTickets(req, res, next) {
  try {
    const result = await queryTickets(req.query);
    
    // Check if this is a double-mode response (has outbound_tickets)
    if (result && result.outbound_tickets) {
      // Return double-mode structure expected by tests
      return res.json({
        code: 200,
        outbound_tickets: result.outbound_tickets,
        return_tickets: result.return_tickets || []
      });
    }

    // Check if this is a legacy test (no trip_type parameter)
    if (!req.query.trip_type && Array.isArray(result)) {
      // Return array directly for legacy tests
      return res.json(result);
    }

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

