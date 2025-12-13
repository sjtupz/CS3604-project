const { searchTickets } = require('../src/controllers/ticketController');

// Mock Request and Response
const mockReq = (query) => ({ query });
const mockRes = (label) => ({
  status: (code) => ({
    json: (data) => console.log(`[${label}] Status ${code}:`, JSON.stringify(data, null, 2))
  }),
  json: (data) => {
    console.log(`[${label}] Success. Found ${data.data.length} trains.`);
    if (data.data.length > 0) {
      console.log(`[${label}] Sample:`, JSON.stringify(data.data[0], null, 2));
    } else {
      console.log(`[${label}] No results found.`);
    }
  }
});

async function runTests() {
  const commonParams = {
    from_station: '上海',
    to_station: '北京',
    date: new Date().toISOString().split('T')[0] // Today
  };

  console.log('--- Starting Filter Tests ---');

  // 1. Basic Search (No filters)
  await searchTickets(
    mockReq({ ...commonParams }),
    mockRes('Basic Search')
  );

  // 2. Filter by Train Type (G)
  await searchTickets(
    mockReq({ ...commonParams, train_type: 'G' }),
    mockRes('Filter Type G')
  );

  // 3. Filter by Price (Max 200)
  // Note: G trains are usually expensive (>500), Z/T/K are cheaper.
  await searchTickets(
    mockReq({ ...commonParams, price_max: '200' }),
    mockRes('Filter Price < 200')
  );

  // 4. Filter by Departure Time (Morning 06:00 - 10:00)
  await searchTickets(
    mockReq({ ...commonParams, dep_time_min: '06:00', dep_time_max: '10:00' }),
    mockRes('Filter Dep 06-10')
  );

  // 5. Filter by Duration (< 6 hours)
  // G trains take ~4-5h. Z/T take >10h.
  await searchTickets(
    mockReq({ ...commonParams, duration_max: '6' }),
    mockRes('Filter Duration < 6h')
  );

  // 6. Combined Filter (G train, Morning)
  await searchTickets(
    mockReq({ ...commonParams, train_type: 'G', dep_time_min: '06:00', dep_time_max: '12:00' }),
    mockRes('Combined G + Morning')
  );

}

runTests();
