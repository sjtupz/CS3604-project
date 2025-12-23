const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const SeedRandom = require('../src/utils/seedRandom');

const DB_PATH = path.join(__dirname, '../data/12306.db');
const db = new sqlite3.Database(DB_PATH);
const rng = new SeedRandom(20251223);

const DAYS_TO_GENERATE = 15;
const TRAINS_PER_SLOT_MIN = 3;
const TRAINS_PER_SLOT_MAX = 5;
const MAX_CITIES_TO_PROCESS = 20; // Limit to avoid DB explosion (20 cities -> ~380 pairs -> ~100k trains)

const TIME_SLOTS = [
  { start: 0, end: 6 },
  { start: 6, end: 12 },
  { start: 12, end: 18 },
  { start: 18, end: 24 }
];

const TRAIN_PREFIXES = ['G', 'D', 'Z', 'T', 'K', ''];

const SEAT_TYPES = [
    'business', 'first', 'second', 'soft_sleeper', 'hard_sleeper', 'hard_seat', 'no_seat'
];

// Helper to run query
const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
});

const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this);
    });
});

const exec = (sql) => new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
    });
});

async function main() {
    console.log('Starting data expansion...');
    
    // 1. Get all stations and group by city
    const stations = await query('SELECT station_id, name, city_code, city FROM rf_stations');
    const cityMap = {};
    stations.forEach(s => {
        if (!cityMap[s.city]) {
            cityMap[s.city] = [];
        }
        cityMap[s.city].push(s);
    });

    // 2. Select target cities (Top N by station count to prioritize major hubs)
    let cities = Object.keys(cityMap).sort((a, b) => cityMap[b].length - cityMap[a].length);
    
    console.log(`Found ${cities.length} cities.`);
    if (cities.length > MAX_CITIES_TO_PROCESS) {
        console.log(`Limiting to top ${MAX_CITIES_TO_PROCESS} cities to prevent database explosion.`);
        cities = cities.slice(0, MAX_CITIES_TO_PROCESS);
    }
    console.log(`Processing cities: ${cities.join(', ')}`);

    // 3. Generate City Pairs
    const routes = [];
    for (let i = 0; i < cities.length; i++) {
        for (let j = 0; j < cities.length; j++) {
            if (i === j) continue;
            routes.push({ from: cities[i], to: cities[j] });
        }
    }
    console.log(`Generated ${routes.length} city pairs.`);

    // 4. Prepare Statements
    await exec('BEGIN TRANSACTION');

    const stmtTrain = db.prepare('INSERT INTO rf_trains (train_number, train_type, origin_station_id, destination_station_id, duration_minutes, stop_count) VALUES (?, ?, ?, ?, ?, ?)');
    const stmtTimetable = db.prepare('INSERT INTO rf_timetables (train_id, station_id, stop_order, arrival_time, departure_time, stop_minutes) VALUES (?, ?, ?, ?, ?, ?)');
    const stmtInventory = db.prepare('INSERT INTO rf_inventories (train_id, travel_date, from_station_id, to_station_id, business_remaining, first_remaining, second_remaining, soft_sleeper_remaining, hard_sleeper_remaining, hard_seat_remaining, no_seat_remaining) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const stmtFare = db.prepare('INSERT INTO rf_fares (train_id, seat_type, base_price) VALUES (?, ?, ?)');

    // 5. Loop Days
    const startDate = new Date(); // Today
    let totalTrains = 0;

    for (let day = 0; day < DAYS_TO_GENERATE; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        console.log(`Generating data for ${dateStr}...`);

        // Loop Routes
        for (const route of routes) {
            const fromCityStations = cityMap[route.from];
            const toCityStations = cityMap[route.to];

            // Loop Time Slots
            for (const slot of TIME_SLOTS) {
                const trainCount = Math.floor(rng.next() * (TRAINS_PER_SLOT_MAX - TRAINS_PER_SLOT_MIN + 1)) + TRAINS_PER_SLOT_MIN;

                for (let k = 0; k < trainCount; k++) {
                    // Random stations
                    const fromStation = fromCityStations[Math.floor(rng.next() * fromCityStations.length)];
                    const toStation = toCityStations[Math.floor(rng.next() * toCityStations.length)];

                    // Train Basic Info
                    const prefix = TRAIN_PREFIXES[Math.floor(rng.next() * TRAIN_PREFIXES.length)];
                    const number = `${prefix}${Math.floor(rng.next() * 9000) + 1000}`;
                    
                    // Time
                    const hour = Math.floor(rng.next() * (slot.end - slot.start)) + slot.start;
                    const minute = Math.floor(rng.next() * 60);
                    const duration = Math.floor(rng.next() * 300) + 30; // 30min to 5.5h
                    const depTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                    
                    const depMin = hour * 60 + minute;
                    const arrMin = depMin + duration;
                    const arrHour = Math.floor(arrMin / 60) % 24;
                    const arrMinute = arrMin % 60;
                    const arrTime = `${String(arrHour).padStart(2, '0')}:${String(arrMinute).padStart(2, '0')}`;
                    const dayDiff = Math.floor(arrMin / 1440);

                    // Insert Train
                    // We need to use run() to get ID, but inside transaction with prepare is tricky with node-sqlite3 if we need the ID immediately for next inserts.
                    // node-sqlite3's statement.run() returns 'this' which contains lastID.
                    
                    await new Promise((resolve, reject) => {
                        stmtTrain.run([number, prefix || 'K', fromStation.station_id, toStation.station_id, duration, 2], function(err) {
                            if (err) return reject(err);
                            const trainId = this.lastID;

                            // Insert Timetables (Origin)
                            stmtTimetable.run([trainId, fromStation.station_id, 1, depTime, depTime, 0]);
                            // Insert Timetables (Dest)
                            stmtTimetable.run([trainId, toStation.station_id, 2, arrTime, arrTime, 0]);

                            // Backup Only Logic (10% chance)
                            const isBackupOnly = rng.next() < 0.1;

                            // Insert Inventory
                            const seats = {};
                            SEAT_TYPES.forEach(type => {
                                seats[type] = isBackupOnly ? 0 : Math.floor(rng.next() * 101); // 0-100
                            });

                            stmtInventory.run([
                                trainId, dateStr, fromStation.station_id, toStation.station_id,
                                seats.business, seats.first, seats.second, seats.soft_sleeper,
                                seats.hard_sleeper, seats.hard_seat, seats.no_seat
                            ]);

                            // Insert Fares
                            // Base price random 50 - 1000
                            const basePrice = Math.floor(rng.next() * 950) + 50;
                            // Multipliers
                            stmtFare.run([trainId, '商务座', basePrice * 3]);
                            stmtFare.run([trainId, '一等座', basePrice * 1.6]);
                            stmtFare.run([trainId, '二等座', basePrice]);
                            stmtFare.run([trainId, '软卧', basePrice * 2]);
                            stmtFare.run([trainId, '硬卧', basePrice * 1.4]);
                            stmtFare.run([trainId, '硬座', basePrice * 0.8]);
                            stmtFare.run([trainId, '无座', basePrice * 0.8]);

                            resolve();
                        });
                    });
                    
                    totalTrains++;
                }
            }
        }
    }

    stmtTrain.finalize();
    stmtTimetable.finalize();
    stmtInventory.finalize();
    stmtFare.finalize();

    await exec('COMMIT');
    console.log(`Completed! Generated ${totalTrains} trains.`);
}

main().catch(err => {
    console.error('Error:', err);
    db.exec('ROLLBACK');
});
