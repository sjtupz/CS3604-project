const {
  findTrainsInDb,
  getTrainScheduleFromDb,
  findTrainsRoundTripInDb,
} = require('../db/train');

function paginate(total, page = 1, pageSize = 20) {
  const currentPage = Number(page) || 1;
  const perPage = Number(pageSize) || 20;
  const totalPages = Math.ceil(total / perPage);
  return { total, currentPage, perPage, totalPages };
}

async function findTrains(params) {
  const items = await findTrainsInDb(params);
  let shaped = items.map((t) => {
    // If the DB already provided seat availability (normalized schema), use it.
    if (t.seatAvailability) {
      return t;
    }
    // Fallback for legacy data without seat info
    return {
      ...t,
      seatAvailability: {
        '一等座': { remaining: 12 },
        '二等座': { remaining: 0, backupOnly: true },
        '软卧': { remaining: null, hasSeatType: false },
      },
    };
  });

  const sortBy = String(params?.sortBy || '').trim();
  const sortOrder = String(params?.sortOrder || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
  const toMinutes = (s) => {
    const parts = String(s || '').split(':').map((n) => Number(n));
    if (parts.length !== 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return 0;
    return parts[0] * 60 + parts[1];
  };
  const durationToMinutes = (s) => {
    const m = String(s || '').match(/(\d+)h(\d+)m/);
    if (!m) return 0;
    return Number(m[1]) * 60 + Number(m[2]);
  };

  if (sortBy === 'departureTime') {
    shaped.sort((a, b) => {
      const diff = toMinutes(a.departureTime) - toMinutes(b.departureTime);
      return sortOrder === 'desc' ? -diff : diff;
    });
  }
  if (sortBy === 'arrivalTime') {
    shaped.sort((a, b) => {
      const diff = toMinutes(a.arrivalTime) - toMinutes(b.arrivalTime);
      return sortOrder === 'desc' ? -diff : diff;
    });
  }
  if (sortBy === 'duration') {
    shaped.sort((a, b) => {
      const diff = durationToMinutes(a.duration) - durationToMinutes(b.duration);
      return sortOrder === 'desc' ? -diff : diff;
    });
  }
  if (sortBy === 'price') {
    shaped.sort((a, b) => {
      const diff = Number(a.price || 0) - Number(b.price || 0);
      return sortOrder === 'desc' ? -diff : diff;
    });
  }

  const total = shaped.length;
  const page = Number(params?.page || 1);
  const pageSize = Number(params?.pageSize || 20);
  const start = (page - 1) * pageSize;
  const paginatedItems = shaped.slice(start, start + pageSize);

  return {
    items: paginatedItems,
    pagination: paginate(total, page, pageSize),
  };
}

async function searchTrains(params) {
  return await findTrains(params);
}

async function getTrainSchedule(trainNumber, date) {
  const data = await getTrainScheduleFromDb(trainNumber, date);
  return data || null;
}

async function findTrainsRoundTrip(params) {
  const res = await findTrainsRoundTripInDb(params);
  const outbound = (res.outbound || []).map((t) => ({
    ...t,
    seatAvailability: {
      '一等座': { remaining: 12 },
      '二等座': { remaining: 0, backupOnly: true },
      '软卧': { remaining: null, hasSeatType: false },
    },
  }));
  const ret = (res.return || []).map((t) => ({
    ...t,
    seatAvailability: {
      '一等座': { remaining: 12 },
      '二等座': { remaining: 0, backupOnly: true },
      '软卧': { remaining: null, hasSeatType: false },
    },
  }));
  return {
    outbound,
    return: ret,
    pagination: paginate(100, params?.page, params?.pageSize),
  };
}

module.exports = {
  findTrains,
  searchTrains,
  getTrainSchedule,
  findTrainsRoundTrip,
};
