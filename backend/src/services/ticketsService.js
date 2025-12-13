const { listTickets, findTickets } = require('../db/tickets');

async function queryTickets(params) {
  // [DEBUG] Check Params
  console.log("Incoming Query Params:", params);
  
  const {
    trip_type,
    start_station,
    end_station,
    outbound_date,
    return_date,
    date,
    from,
    to,
    filterType,
    filterStationIn,
    filterStationOut,
    filterTimeStr,
  } = params;

  // [DEBUG] Check Parsed Date
  if (outbound_date) {
      console.log("Parsed Date for SQL (outbound):", outbound_date);
  }
  if (return_date) {
      console.log("Parsed Date for SQL (return):", return_date);
  }

  if (trip_type || (start_station && end_station && outbound_date)) {
    console.log('[DEBUG] Entering double-mode query path');
    const outbound = await findTickets({ 
      start_station, 
      end_station, 
      date: outbound_date 
    });
    console.log('[DEBUG] Outbound result count:', outbound.length);

    let returnTickets = [];
    if (trip_type === 'round-trip' && return_date) {
      console.log('[DEBUG] querying return tickets');
      returnTickets = await findTickets({ 
        start_station: end_station, 
        end_station: start_station, 
        date: return_date 
      });
    }

    const response = {
      outbound_tickets: outbound,
      return_tickets: returnTickets
    };
    console.log('[DEBUG] API Response Structure:', {
      outbound_count: response.outbound_tickets.length,
      return_count: response.return_tickets.length
    });
    return response;
  }

  console.log('[DEBUG] Entering legacy listTickets path');
  const rows = await listTickets({ date, from, to, filterType, filterStationIn, filterStationOut, filterTimeStr });
  return rows;
}

module.exports = { queryTickets };
