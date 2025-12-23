const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const SeedRandom = require('../src/utils/seedRandom');

const DB_PATH = path.join(__dirname, '../data/12306.db');
const db = new sqlite3.Database(DB_PATH);
const rng = new SeedRandom(20250101); // New seed for this task

const DAYS_TO_GENERATE = 15;
const START_DATE = new Date();

// Configuration
const TARGET_CITIES = {
  '上海': {
    code: '310000',
    province: '上海',
    stations: [
      { name: '上海', code: 'SHH', lat: 31.25, lng: 121.47 },
      { name: '上海虹桥', code: 'AOH', lat: 31.19, lng: 121.32 },
      { name: '上海南', code: 'SNH', lat: 31.15, lng: 121.43 },
      { name: '上海西', code: 'SXH', lat: 31.26, lng: 121.40 },
      { name: '松江', code: 'SJH', lat: 31.00, lng: 121.23 }
    ]
  },
  '苏州': {
    code: '320500',
    province: '江苏',
    stations: [
      { name: '苏州', code: 'SZH', lat: 31.32, lng: 120.61 },
      { name: '苏州北', code: 'OHH', lat: 31.42, lng: 120.64 },
      { name: '昆山南', code: 'KNH', lat: 31.35, lng: 120.95 },
      { name: '昆山', code: 'KSH', lat: 31.39, lng: 120.96 },
      { name: '苏州园区', code: 'KAH', lat: 31.31, lng: 120.71 },
      { name: '苏州新区', code: 'ITH', lat: 31.33, lng: 120.53 }
    ]
  }
};

const TIME_SLOTS = [
  { start: 0, end: 6 },
  { start: 6, end: 12 },
  { start: 12, end: 18 },
  { start: 18, end: 24 }
];

// Helpers
const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
});

const exec = (sql) => new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
    });
});

async function ensureStations() {
  console.log('Verifying stations...');
  
  for (const [cityName, cityData] of Object.entries(TARGET_CITIES)) {
    // 1. Ensure City
    const cityExists = await get('SELECT city_code FROM rf_cities WHERE name = ?', [cityName]);
    let cityCode = cityData.code;
    
    if (!cityExists) {
        console.log(`Creating city: ${cityName}`);
        await run('INSERT INTO rf_cities (city_code, name, province, level, pinyin) VALUES (?, ?, ?, ?, ?)',
            [cityCode, cityName, cityData.province, '地级市', 'TODO']);
    } else {
        cityCode = cityExists.city_code;
    }

    // 2. Ensure Stations
    for (const st of cityData.stations) {
        const stExists = await get('SELECT station_id FROM rf_stations WHERE name = ?', [st.name]);
        if (!stExists) {
            console.log(`Creating station: ${st.name}`);
            await run('INSERT INTO rf_stations (name, code, pinyin, city_code, city, ad_code, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [st.name, st.code, 'TODO', cityCode, cityName, cityCode + '01', st.lat, st.lng]);
        }
    }
  }
}

async function generateTrains() {
    console.log('Generating Shanghai-Suzhou schedules...');
    
    // Get station IDs
    const shStations = await Promise.all(TARGET_CITIES['上海'].stations.map(async s => {
        const row = await get('SELECT station_id, name FROM rf_stations WHERE name = ?', [s.name]);
        return row;
    }));
    const szStations = await Promise.all(TARGET_CITIES['苏州'].stations.map(async s => {
        const row = await get('SELECT station_id, name FROM rf_stations WHERE name = ?', [s.name]);
        return row;
    }));

    const trains = [];

    await exec('BEGIN TRANSACTION');
    try {
        // Base routes generation (Train Definitions)
        // We generate a set of trains that run daily
        const routes = [];
        const trainCountPerSlot = 3; // 3 trains per slot per direction = 12 trains/day/direction = 24 total/day

        // Generate abstract train definitions first
        for (const slot of TIME_SLOTS) {
            for (let i = 0; i < trainCountPerSlot; i++) {
                // Direction 1: SH -> SZ
                routes.push(createRoute(shStations, szStations, slot));
                // Direction 2: SZ -> SH
                routes.push(createRoute(szStations, shStations, slot));
            }
        }

        // Insert Trains and Timetables (Abstract)
        // Note: in RF schema, rf_trains is usually the "physical train info". 
        // rf_inventories binds it to a date. 
        // However, typically train_number might be unique. 
        // For simplicity, we create one rf_train entry per schedule and reuse it across dates?
        // Or create distinct rf_trains? 
        // In 12306, Train No (G101) is the same. 
        // Let's create unique rf_train entries for the "Base Schedule".
        
        const baseTrainIds = [];

        for (const route of routes) {
            const { origin, dest, slot, type } = route;
            const trainNum = generateTrainNumber(type);
            
            // Calc times
            const startHour = rng.range(slot.start, slot.end - 1);
            const startMin = rng.range(0, 59);
            const departureTimeMinutes = startHour * 60 + startMin;
            
            const distance = 80 + rng.range(-10, 10);
            const duration = type === 'G' ? rng.range(25, 35) : (type === 'D' ? rng.range(35, 50) : rng.range(50, 90));
            
            const res = await run(
                'INSERT INTO rf_trains (train_number, train_type, origin_station_id, destination_station_id, distance_km, duration_minutes, stop_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [trainNum, type, origin.station_id, dest.station_id, distance, duration, 2]
            );
            const trainId = res.lastID;
            baseTrainIds.push({ trainId, origin, dest, duration, distance, type });

            // Timetables
            const depStr = formatTime(departureTimeMinutes);
            const arrStr = formatTime(departureTimeMinutes + duration);

            // Origin
            await run('INSERT INTO rf_timetables (train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES (?, ?, ?, ?, ?, ?)',
                [trainId, origin.station_id, '-', depStr, 0, 1]);
            
            // Dest
            await run('INSERT INTO rf_timetables (train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES (?, ?, ?, ?, ?, ?)',
                [trainId, dest.station_id, arrStr, '-', 0, 2]);

            // Fares
            const basePrice = distance * (type === 'G' ? 0.5 : 0.3);
            await insertFares(trainId, type, basePrice);
        }

        // Generate Inventories for 15 Days
        console.log(`Generated ${baseTrainIds.length} base routes. Creating inventories for ${DAYS_TO_GENERATE} days...`);

        for (let d = 0; d < DAYS_TO_GENERATE; d++) {
            const date = new Date(START_DATE);
            date.setDate(START_DATE.getDate() + d);
            const dateStr = formatDate(date);

            for (const t of baseTrainIds) {
                await run(
                    `INSERT INTO rf_inventories (
                        train_id, travel_date, from_station_id, to_station_id, 
                        business_remaining, first_remaining, second_remaining, 
                        soft_sleeper_remaining, hard_sleeper_remaining, hard_seat_remaining, no_seat_remaining
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        t.trainId, dateStr, t.origin.station_id, t.dest.station_id,
                        rng.range(0, 10), rng.range(0, 50), rng.range(10, 200), // Seats
                        rng.range(0, 5), rng.range(0, 10), rng.range(0, 50), rng.range(0, 20) // Others
                    ]
                );
            }
        }

        await exec('COMMIT');
        console.log('Data generation complete.');

    } catch (err) {
        console.error('Error during generation:', err);
        await exec('ROLLBACK');
        throw err;
    }
}

function createRoute(fromList, toList, slot) {
    const origin = rng.pick(fromList);
    const dest = rng.pick(toList);
    const type = rng.pick(['G', 'G', 'D', 'K']); // Higher chance for G
    return { origin, dest, slot, type };
}

function generateTrainNumber(type) {
    return type + rng.range(1000, 9999);
}

function formatTime(minutes) {
    let h = Math.floor(minutes / 60) % 24;
    let m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

async function insertFares(trainId, type, basePrice) {
    const seats = ['商务座', '一等座', '二等座', '软卧', '硬卧', '硬座', '无座'];
    for (const seat of seats) {
        if (type === 'G' && ['软卧', '硬卧', '硬座'].includes(seat)) continue;
        if (type !== 'G' && ['商务座', '一等座'].includes(seat)) continue;
        
        let multiplier = 1;
        if (seat === '商务座') multiplier = 3.0;
        if (seat === '一等座') multiplier = 1.6;
        if (seat === '软卧') multiplier = 1.5;
        
        await run('INSERT INTO rf_fares (train_id, seat_type, base_price) VALUES (?, ?, ?)',
          [trainId, seat, Math.floor(basePrice * multiplier)]);
    }
}

// Main execution
(async () => {
    try {
        await ensureStations();
        await generateTrains();
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        db.close();
    }
})();
