const sqlite3 = require('sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/12306.db');
const db = new sqlite3.Database(DB_PATH);

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedPopularRoutes() {
  console.log('Seeding popular routes (Shanghai <-> Beijing)...');
  
  // 1. Find Stations
  const stations = await all("SELECT station_id, name, city FROM rf_stations WHERE city IN ('上海', '北京')");
  
  // Group by city
  const shStations = stations.filter(s => s.city === '上海');
  const bjStations = stations.filter(s => s.city === '北京');

  if (shStations.length === 0 || bjStations.length === 0) {
    console.error('Could not find stations for Shanghai or Beijing. Please run seed_full_db.js first.');
    return;
  }

  // Helper to find specific station or fallback to first available
  const findStation = (list, name) => list.find(s => s.name === name) || list[0];

  const shStation = findStation(shStations, '上海站');
  const shHqStation = findStation(shStations, '上海虹桥站');
  const bjStation = findStation(bjStations, '北京站');
  const bjSouthStation = findStation(bjStations, '北京南站');

  console.log(`Using stations: SH=${shStation.name}, SH_HQ=${shHqStation.name}, BJ=${bjStation.name}, BJ_S=${bjSouthStation.name}`);

  const routes = [
    // G1: SH Hongqiao -> BJ South (High Speed)
    {
      number: 'G1', type: 'G', origin: shHqStation, dest: bjSouthStation,
      start: '09:00', duration: 270, dist: 1318,
      seats: ['商务座', '一等座', '二等座']
    },
    // G2: BJ South -> SH Hongqiao
    {
      number: 'G2', type: 'G', origin: bjSouthStation, dest: shHqStation,
      start: '09:00', duration: 270, dist: 1318,
      seats: ['商务座', '一等座', '二等座']
    },
    // G10: SH Hongqiao -> BJ South (Afternoon)
    {
      number: 'G10', type: 'G', origin: shHqStation, dest: bjSouthStation,
      start: '14:00', duration: 280, dist: 1318,
      seats: ['商务座', '一等座', '二等座']
    },
    // D701: SH -> BJ South (Overnight Sleeper)
    {
      number: 'D701', type: 'D', origin: shStation, dest: bjSouthStation,
      start: '21:15', duration: 700, dist: 1463, // ~11h 40m
      seats: ['二等座', '软卧', '硬卧'] // D-sleepers usually have soft/hard sleeper
    },
    // T110: SH -> BJ (Traditional Slow)
    {
      number: 'T110', type: 'T', origin: shStation, dest: bjStation,
      start: '18:05', duration: 930, dist: 1463, // ~15h 30m
      seats: ['软卧', '硬卧', '硬座', '无座']
    },
    // K234: SH -> BJ (Very Slow)
    {
      number: 'K234', type: 'K', origin: shStation, dest: bjStation,
      start: '11:30', duration: 1150, dist: 1463, // ~19h
      seats: ['软卧', '硬卧', '硬座', '无座']
    }
  ];

  await run('BEGIN TRANSACTION');

  try {
    const today = new Date();

    for (const r of routes) {
      console.log(`Creating train ${r.number}: ${r.origin.name} -> ${r.dest.name}`);
      
      // Check if exists
      const existing = await get("SELECT train_id FROM rf_trains WHERE train_number = ?", [r.number]);
      if (existing) {
        console.log(`Train ${r.number} already exists, skipping creation.`);
        continue;
      }

      // Insert Train
      await run(`INSERT INTO rf_trains (
        train_number, train_type, origin_station_id, destination_station_id, distance_km, duration_minutes, stop_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        r.number, r.type, r.origin.station_id, r.dest.station_id, r.dist, r.duration, 5
      ]);

      const trainRow = await get('SELECT last_insert_rowid() as id');
      const trainId = trainRow.id;

      // Timetables
      const [sh, sm] = r.start.split(':').map(Number);
      const startMins = sh * 60 + sm;
      const endMins = startMins + r.duration;
      const eh = Math.floor(endMins / 60) % 24;
      const em = endMins % 60;
      const endTime = `${String(eh).padStart(2,'0')}:${String(em).padStart(2,'0')}`;

      await run(`INSERT INTO rf_timetables (train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES (?, ?, ?, ?, ?, ?)`,
        [trainId, r.origin.station_id, r.start, r.start, 0, 1]);
      
      await run(`INSERT INTO rf_timetables (train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES (?, ?, ?, ?, ?, ?)`,
        [trainId, r.dest.station_id, endTime, endTime, 0, 5]);

      // Fares
      const basePrice = r.dist * (r.type === 'G' ? 0.46 : (r.type === 'D' ? 0.3 : 0.15)); // Approx rates
      
      if (r.seats.includes('二等座')) await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '二等座', basePrice.toFixed(2), 1.0]);
      if (r.seats.includes('一等座')) await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '一等座', (basePrice * 1.6).toFixed(2), 1.6]);
      if (r.seats.includes('商务座')) await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '商务座', (basePrice * 3).toFixed(2), 3.0]);
      if (r.seats.includes('软卧')) await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '软卧', (basePrice * 2.5).toFixed(2), 2.5]);
      if (r.seats.includes('硬卧')) await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '硬卧', (basePrice * 1.8).toFixed(2), 1.8]);
      if (r.seats.includes('硬座')) await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '硬座', basePrice.toFixed(2), 1.0]);
      if (r.seats.includes('无座')) await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '无座', basePrice.toFixed(2), 1.0]);

      // Inventory for 30 days
      for (let d = 0; d < 30; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() + d);
        const dateStr = date.toISOString().split('T')[0];

        // Ensure no dupes
        await run('DELETE FROM rf_inventories WHERE train_id = ? AND travel_date = ?', [trainId, dateStr]);

        const isSoldOut = randInt(0, 20) === 0; 

        await run(`INSERT INTO rf_inventories (
          train_id, travel_date, from_station_id, to_station_id,
          business_remaining, first_remaining, second_remaining,
          soft_sleeper_remaining, hard_sleeper_remaining, hard_seat_remaining, no_seat_remaining
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
          trainId, dateStr, r.origin.station_id, r.dest.station_id,
          (r.seats.includes('商务座') && !isSoldOut) ? randInt(0, 10) : 0,
          (r.seats.includes('一等座') && !isSoldOut) ? randInt(0, 30) : 0,
          (r.seats.includes('二等座') && !isSoldOut) ? randInt(0, 100) : 0,
          (r.seats.includes('软卧') && !isSoldOut) ? randInt(0, 20) : 0,
          (r.seats.includes('硬卧') && !isSoldOut) ? randInt(0, 50) : 0,
          (r.seats.includes('硬座') && !isSoldOut) ? randInt(0, 100) : 0,
          (r.seats.includes('无座') && !isSoldOut) ? randInt(0, 50) : 0
        ]);
      }
    }

    await run('COMMIT');
    console.log('Popular routes seeded successfully.');

  } catch (err) {
    await run('ROLLBACK');
    console.error('Failed to seed popular routes:', err);
  } finally {
    db.close();
  }
}

seedPopularRoutes();
