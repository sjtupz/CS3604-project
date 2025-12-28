const { getDb } = require('../db/personal_database');
const { insertTrainTickets } = require('../db/tickets');

// Helper to get all stations from DB
function getAllStations() {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.all("SELECT name, city, pinyin FROM stations", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Helper to generate random integer
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to pick random item
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

// Helper to generate train number
function makeTrainNo(type) {
  if (type === 'G') return `G${randInt(100, 9999)}`;
  if (type === 'C') return `C${randInt(100, 2999)}`;
  if (type === 'D') return `D${randInt(300, 3999)}`;
  if (type === 'Z') return `Z${randInt(1, 999)}`;
  if (type === 'T') return `T${randInt(1, 999)}`;
  return `K${randInt(1, 999)}`;
}

// Helper to generate seat status
function seatStatusBias(type) {
  const pool = ['有', '无', '候补'];
  const num = () => String(randInt(1, 20)); // Return a number string
  
  // Helper for probability
  function pickStatus(baseBias) {
    const r = Math.random();
    if (r < baseBias) return '有'; // Or specific number? 
    // Requirement says "ticket quantities", implying numbers. 
    // But generator.js used '有'/'无'. 
    // Let's use numbers mostly, and '无' sometimes.
    // Actually, '有' usually means "Enough".
    // Let's return numbers to be precise for DB, or string '有' if that's the convention.
    // Looking at train.js: it just returns the value.
    // Let's stick to generator.js logic which returns '有'/'无'/number.
    if (r < baseBias) return num();
    if (r < baseBias + 0.2) return '无';
    if (r < baseBias + 0.4) return '候补';
    return num();
  }

  return {
    swz_num: (type === 'G' || type === 'C') ? pickStatus(0.5) : '--',
    yd_num: (type === 'G' || type === 'C' || type === 'D') ? pickStatus(0.5) : '--',
    ed_num: (type === 'G' || type === 'C' || type === 'D') ? pickStatus(type === 'G' ? 0.3 : 0.5) : '--',
    rw_num: (type === 'Z' || type === 'T' || type === 'K' || type === 'D') ? pickStatus(0.4) : '--',
    yw_num: (type === 'Z' || type === 'T' || type === 'K') ? pickStatus(0.5) : '--',
    yz_num: (type === 'Z' || type === 'T' || type === 'K') ? pickStatus(0.5) : '--',
    wz_num: pickStatus(0.6)
  };
}

// Format time HH:mm
function formatTime(minutes) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Main generation function
async function generateTicketsInDb({ days = 15, minTrainsPerDay = 100, maxTrainsPerDay = 300, clearExisting = false } = {}) {
  console.log('Starting ticket generation...');
  console.log(`Configuration: Days=${days}, Min=${minTrainsPerDay}, Max=${maxTrainsPerDay}, Clear=${clearExisting}`);
  
  const db = getDb();
  
  // 1. Fetch stations
  const stations = await getAllStations();
  if (!stations || stations.length < 2) {
    console.error('Not enough stations in DB to generate routes.');
    return;
  }
  
  // Group by city for logical routes
  const cityStations = {};
  stations.forEach(s => {
    if (!cityStations[s.city]) cityStations[s.city] = [];
    cityStations[s.city].push(s);
  });
  const cities = Object.keys(cityStations);

  // 2. Prepare batches
  const allTickets = [];
  const today = new Date();
  
  // Time slots definition
  const timeSlots = [
    { start: 0, end: 360 },      // 00:00 - 06:00
    { start: 360, end: 720 },    // 06:00 - 12:00
    { start: 720, end: 1080 },   // 12:00 - 18:00
    { start: 1080, end: 1440 }   // 18:00 - 24:00
  ];

  // Optional: Clear existing data for the target date range to avoid duplicates
  if (clearExisting) {
      const startDate = today.toISOString().split('T')[0];
      const endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      console.log(`Clearing tickets from ${startDate} to ${endDate}...`);
      await new Promise((resolve, reject) => {
          db.run("DELETE FROM train_tickets WHERE date >= ? AND date <= ?", [startDate, endDate], (err) => {
              if (err) reject(err); else resolve();
          });
      });
  }

  // 3. Generate
  for (let d = 0; d < days; d++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + d);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Randomize ticket quantity per day
    const dailyTrainCount = randInt(minTrainsPerDay, maxTrainsPerDay);
    
    // Track generated train numbers for this day to ensure uniqueness
    const usedTrainNos = new Set();

    for (let i = 0; i < dailyTrainCount; i++) {
      // Pick two different cities
      const fromCity = pick(cities);
      let toCity = pick(cities);
      while (toCity === fromCity) {
        toCity = pick(cities);
      }
      
      // Pick stations within cities
      const fromStation = pick(cityStations[fromCity]);
      const toStation = pick(cityStations[toCity]);
      
      // Train attributes
      const type = pick(['G', 'D', 'Z', 'T', 'K']);
      
      // Ensure unique train number per day
      let trainNo = makeTrainNo(type);
      let attempts = 0;
      while (usedTrainNos.has(trainNo) && attempts < 100) {
          trainNo = makeTrainNo(type);
          attempts++;
      }
      usedTrainNos.add(trainNo);
      
      // Time slot distribution (randomly pick a slot)
      const slot = pick(timeSlots);
      const startMin = randInt(slot.start, slot.end - 1); // Random start time in slot
      const durationMin = randInt(30, 600); // 30 min to 10 hours
      const endMin = startMin + durationMin;
      
      const startTime = formatTime(startMin);
      const endTime = formatTime(endMin);
      const duration = `${Math.floor(durationMin / 60)}h${durationMin % 60}m`;
      
      // Seat availability
      const seats = seatStatusBias(type);
      
      allTickets.push({
        train_no: trainNo,
        train_type: type,
        start_station: fromStation.name,
        end_station: toStation.name,
        start_time: startTime,
        end_time: endTime,
        duration: duration,
        date: dateStr,
        ...seats
      });
    }
  }
  
  console.log(`Generated ${allTickets.length} tickets. Inserting into DB...`);
  
  // 4. Insert in chunks using transaction
  // insertTrainTickets handles transaction, but for large dataset, maybe split?
  // 15 days * 200 trains = 3000 rows. SQLite can handle this in one transaction easily.
  
  try {
    // Optional: Add indexes if not exist to satisfy "optimize SQL query performance"
    const db = getDb();
    await new Promise((resolve) => {
        db.serialize(() => {
            db.run("CREATE INDEX IF NOT EXISTS idx_train_tickets_start ON train_tickets(start_station)");
            db.run("CREATE INDEX IF NOT EXISTS idx_train_tickets_end ON train_tickets(end_station)");
            db.run("CREATE INDEX IF NOT EXISTS idx_train_tickets_date ON train_tickets(date)", () => resolve());
        });
    });

    await insertTrainTickets(allTickets);
    console.log('Tickets inserted successfully.');
    
    // Validation
    const count = await new Promise((resolve) => {
        db.get("SELECT count(*) as c FROM train_tickets", (err, row) => resolve(row.c));
    });
    console.log(`Total tickets in DB: ${count}`);
    
  } catch (err) {
    console.error('Error inserting tickets:', err);
    throw err;
  }
}

module.exports = { generateTicketsInDb };
