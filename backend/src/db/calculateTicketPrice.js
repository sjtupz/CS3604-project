async function calculateTicketPrice(params) {
  const fares = params?.segmentFare || {};
  return Object.values(fares).reduce((sum, v) => sum + Number(v || 0), 0);
}

module.exports = { calculateTicketPrice };
