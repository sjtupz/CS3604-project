const path = require('path');
// Ensure we are in development mode to use file-based DB
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const { run, close, initializeDatabase } = require('../db/personal_database');

const TRAIN_TYPES = ['G', 'D', 'Z', 'T', 'K'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad(n) {
  return n < 10 ? '0' + n : n;
}

function getFutureDate(daysToAdd) {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const ROUTES = [
  { from: '上海虹桥', to: '北京南', prefix: 'G', duration: '4h30m', basePrice: 553 },
  { from: '上海', to: '北京', prefix: 'T', duration: '15h', basePrice: 179 },
  { from: '北京西', to: '西安北', prefix: 'G', duration: '4h15m', basePrice: 515 },
  { from: '广州南', to: '深圳北', prefix: 'G', duration: '0h30m', basePrice: 74 },
  { from: '杭州东', to: '南京南', prefix: 'G', duration: '1h10m', basePrice: 110 },
  { from: '上海虹桥', to: '杭州东', prefix: 'G', duration: '0h50m', basePrice: 73 },
  { from: '北京', to: '哈尔滨', prefix: 'Z', duration: '10h', basePrice: 200 },
  { from: '成都东', to: '重庆北', prefix: 'G', duration: '1h30m', basePrice: 154 },
  { from: '武汉', to: '长沙南', prefix: 'G', duration: '1h20m', basePrice: 164 },
  { from: '上海', to: '南京', prefix: 'K', duration: '3h', basePrice: 46 }
];

async function seed() {
  try {
    console.log('Initializing database connection...');
    await initializeDatabase();

    console.log('Ensuring train_tickets table exists...');
    // Create the table with the schema expected by the application
    await run(`
      CREATE TABLE IF NOT EXISTS train_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        train_number TEXT NOT NULL,
        from_station TEXT NOT NULL,
        to_station TEXT NOT NULL,
        date TEXT NOT NULL,
        departure_time TEXT NOT NULL,
        arrival_time TEXT NOT NULL,
        duration TEXT,
        price_business REAL DEFAULT 0,
        price_first REAL DEFAULT 0,
        price_second REAL DEFAULT 0,
        price_soft_sleeper REAL DEFAULT 0,
        price_hard_sleeper REAL DEFAULT 0,
        price_hard_seat REAL DEFAULT 0,
        price_no_seat REAL DEFAULT 0
      )
    `);

    console.log('Clearing old train_tickets data...');
    await run('DELETE FROM train_tickets');

    const entries = [];
    const dates = [0, 1, 2].map(getFutureDate); // Today, Tomorrow, Day After
    console.log(`Generating data for dates: ${dates.join(', ')}`);

    let totalInserted = 0;

    for (const date of dates) {
      for (const route of ROUTES) {
        // Generate 3-5 trains per route per day
        const numTrains = getRandomInt(3, 5);
        for (let i = 0; i < numTrains; i++) {
          const trainNum = `${route.prefix}${getRandomInt(100, 999)}`;
          
          // Random departure time between 06:00 and 22:00
          const startHour = getRandomInt(6, 22);
          const startMin = getRandomInt(0, 59);
          const depTime = `${pad(startHour)}:${pad(startMin)}`;
          
          // Calculate arrival time
          const durationParts = route.duration.match(/(\d+)h(\d*)/);
          let durH = 0, durM = 0;
          if (durationParts) {
             durH = parseInt(durationParts[1]);
             durM = durationParts[2] ? parseInt(durationParts[2]) : 0;
             if (route.duration.includes('m') && !durationParts[2]) {
                // handle cases like "30m" if regex failed, but my routes are structured "XhYm" or "Xh"
                // Re-parsing for safety
                const hMatch = route.duration.match(/(\d+)h/);
                const mMatch = route.duration.match(/(\d+)m/);
                durH = hMatch ? parseInt(hMatch[1]) : 0;
                durM = mMatch ? parseInt(mMatch[1]) : 0;
             }
          }
          
          let arrHour = startHour + durH;
          let arrMin = startMin + durM;
          if (arrMin >= 60) {
            arrHour++;
            arrMin -= 60;
          }
          // Simple wrap for next day (not handling full date increment for arrival, just time)
          const arrHourDisplay = arrHour % 24;
          const arrTime = `${pad(arrHourDisplay)}:${pad(arrMin)}`;
          
          const price = route.basePrice;
          
          // Price multipliers
          const price_business = route.prefix === 'G' ? Math.floor(price * 3) : 0;
          const price_first = route.prefix === 'G' ? Math.floor(price * 1.6) : 0;
          const price_second = route.prefix === 'G' ? price : 0;
          const price_soft_sleeper = ['Z','T','K'].includes(route.prefix) ? Math.floor(price * 1.8) : 0;
          const price_hard_sleeper = ['Z','T','K'].includes(route.prefix) ? Math.floor(price * 1.2) : 0;
          const price_hard_seat = ['Z','T','K'].includes(route.prefix) ? price : 0;
          const price_no_seat = ['Z','T','K'].includes(route.prefix) ? Math.floor(price * 0.8) : 0;

          // For G trains, price is usually second class. 
          // If G train, basePrice is second class.
          // If K/T/Z, basePrice is hard seat.
          
          await run(`
            INSERT INTO train_tickets (
              train_number, from_station, to_station, date, 
              departure_time, arrival_time, duration, 
              price_business, price_first, price_second,
              price_soft_sleeper, price_hard_sleeper, price_hard_seat, price_no_seat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            trainNum, route.from, route.to, date,
            depTime, arrTime, route.duration,
            price_business, price_first, price_second,
            price_soft_sleeper, price_hard_sleeper, price_hard_seat, price_no_seat
          ]);
          totalInserted++;
        }
      }
    }

    console.log(`Seeding completed. Inserted ${totalInserted} train tickets.`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await close();
  }
}

seed();
