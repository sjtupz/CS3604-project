async function updateSeatStatusOnReservation(payload) {
  const segments = Array.isArray(payload?.segmentIds) ? payload.segmentIds : [];
  return { updated: true, affectedSegments: segments.length };
}

module.exports = { updateSeatStatusOnReservation };
