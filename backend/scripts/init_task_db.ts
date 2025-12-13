
import sqlite3 from 'sqlite3';
import path from 'path';

// Database path
const DB_PATH = path.join(__dirname, '../data/task_12306.db');
const db = new sqlite3.Database(DB_PATH);

// Helper to run SQL
const run = (sql: string, params: any[] = []) => new Promise<void>((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) {
      console.error('SQL Error:', err.message, '\nSQL:', sql);
      reject(err);
    } else {
      resolve();
    }
  });
});

async function initDb() {
  console.log('Initializing database at:', DB_PATH);

  // 1. Drop existing tables
  await run('DROP TABLE IF EXISTS tickets');
  await run('DROP TABLE IF EXISTS schedules');
  await run('DROP TABLE IF EXISTS trains');
  await run('DROP TABLE IF EXISTS stations');

  // 2. Create tables
  // Stations
  await run(`
    CREATE TABLE stations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      code TEXT NOT NULL
    )
  `);

  // Trains
  await run(`
    CREATE TABLE trains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_number TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK(type IN ('G', 'D', 'K', 'Z', 'T'))
    )
  `);

  // Schedules (Timetable template)
  await run(`
    CREATE TABLE schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_id INTEGER NOT NULL,
      from_station_id INTEGER NOT NULL,
      to_station_id INTEGER NOT NULL,
      departure_time TEXT NOT NULL, -- HH:mm:ss
      arrival_time TEXT NOT NULL,   -- HH:mm:ss
      status TEXT DEFAULT 'Normal', -- Normal, Suspended
      FOREIGN KEY (train_id) REFERENCES trains(id),
      FOREIGN KEY (from_station_id) REFERENCES stations(id),
      FOREIGN KEY (to_station_id) REFERENCES stations(id)
    )
  `);

  // Tickets (Inventory)
  await run(`
    CREATE TABLE tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      schedule_id INTEGER NOT NULL,
      date TEXT NOT NULL, -- YYYY-MM-DD
      seat_type TEXT NOT NULL, 
      price REAL NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (schedule_id) REFERENCES schedules(id)
    )
  `);

  // Indexes for optimization
  await run('CREATE INDEX idx_tickets_date ON tickets(date)');
  await run('CREATE INDEX idx_tickets_schedule_id ON tickets(schedule_id)');
  await run('CREATE INDEX idx_schedules_from_to ON schedules(from_station_id, to_station_id)');
  await run('CREATE INDEX idx_schedules_train_id ON schedules(train_id)');

  console.log('Tables created.');

  // 3. Seed Data
  
  // Stations
  // 1: SHH, 2: BJP, 3: SH, 4: BJ
  await run(`INSERT INTO stations (name, city, code) VALUES ('上海虹桥', '上海', 'SHH')`);
  await run(`INSERT INTO stations (name, city, code) VALUES ('北京南', '北京', 'VNP')`);
  await run(`INSERT INTO stations (name, city, code) VALUES ('上海', '上海', 'SHH')`);
  await run(`INSERT INTO stations (name, city, code) VALUES ('北京', '北京', 'BJP')`);

  // Data Generators
  const trainTypes = ['G', 'D', 'Z', 'T', 'K'];
  const seatConfig: any = {
    'G': {
      seats: ['商务座', '特等座', '一等座', '二等座'],
      prices: [1800, 1500, 900, 550], 
      speed: 300
    },
    'D': {
      seats: ['一等座', '二等座', '无座', '其他'],
      prices: [700, 450, 450, 200],
      speed: 200
    },
    'Z': {
      seats: ['软卧', '硬卧', '硬座', '无座'],
      prices: [400, 280, 150, 150],
      speed: 120
    },
    'T': {
      seats: ['软卧', '硬卧', '硬座', '无座'],
      prices: [380, 260, 140, 140],
      speed: 100
    },
    'K': {
      seats: ['软卧', '硬卧', '硬座', '无座'],
      prices: [350, 240, 120, 120],
      speed: 80
    }
  };

  const generateTime = (startHour: number, endHour: number) => {
    const h = Math.floor(Math.random() * (endHour - startHour)) + startHour;
    const m = Math.floor(Math.random() * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  };

  const addMinutes = (time: string, minutes: number) => {
    const [h, m, s] = time.split(':').map(Number);
    const date = new Date(2000, 0, 1, h, m, s);
    date.setMinutes(date.getMinutes() + minutes);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`;
  };

  const trains = [];
  let trainIdCounter = 1;

  // Generate 50+ trains
  // Distribute across day parts: 
  // Morning (6-10): 15 trains
  // Mid (10-16): 20 trains
  // Late (16-23): 15 trains
  
  const distributions = [
    { start: 5, end: 10, count: 15 },
    { start: 10, end: 16, count: 20 },
    { start: 16, end: 24, count: 20 }
  ];

  for (const dist of distributions) {
    for (let i = 0; i < dist.count; i++) {
      const type = trainTypes[Math.floor(Math.random() * trainTypes.length)];
      const number = `${type}${Math.floor(Math.random() * 9000) + 100}`;
      
      // Determine Stations (High speed usually Hongqiao-Nan, others Main-Main)
      let fromSt = 3, toSt = 4; // Main to Main
      if (type === 'G' || type === 'D') {
         if (Math.random() > 0.3) { fromSt = 1; toSt = 2; } // 70% chance Hongqiao-Nan
      }

      // Duration based on speed (Distance ~1300km)
      const speed = seatConfig[type].speed;
      const durationHours = (1300 / speed) * (0.9 + Math.random() * 0.2); // +/- variance
      const durationMins = Math.floor(durationHours * 60);
      
      const depTime = generateTime(dist.start, dist.end);
      const arrTime = addMinutes(depTime, durationMins);

      // Status
      const isSuspended = Math.random() < 0.05; // 5% suspended

      trains.push({
        id: trainIdCounter++,
        number,
        type,
        fromSt,
        toSt,
        depTime,
        arrTime,
        status: isSuspended ? 'Suspended' : 'Normal'
      });
    }
  }

  // Insert Trains and Schedules
  for (const t of trains) {
    await run(`INSERT INTO trains (train_number, type) VALUES (?, ?)`, [t.number, t.type]);
    await run(`INSERT INTO schedules (train_id, from_station_id, to_station_id, departure_time, arrival_time, status) VALUES (?, ?, ?, ?, ?, ?)`, 
      [t.id, t.fromSt, t.toSt, t.depTime, t.arrTime, t.status]);
  }

  // Insert Tickets for Today and Tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const targetDates = [today.toISOString().split('T')[0], tomorrow.toISOString().split('T')[0]];

  for (const date of targetDates) {
    for (const t of trains) {
      if (t.status === 'Suspended') continue; // No tickets for suspended trains

      const config = seatConfig[t.type];
      for (let i = 0; i < config.seats.length; i++) {
        const seat = config.seats[i];
        const basePrice = config.prices[i];
        // Price variation
        const price = Math.floor(basePrice * (0.95 + Math.random() * 0.1)); 
        
        // Count: 10% Sold Out
        let count = Math.floor(Math.random() * 100);
        if (Math.random() < 0.1) count = 0;

        await run(`INSERT INTO tickets (schedule_id, date, seat_type, price, count) VALUES (?, ?, ?, ?, ?)`,
          [t.id, date, seat, price, count]);
      }
    }
  }

  console.log(`Seeding completed. Generated ${trains.length} trains.`);
  db.close();
}

initDb().catch(err => {
  console.error(err);
  process.exit(1);
});
