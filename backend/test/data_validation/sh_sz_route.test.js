const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/12306.db');

describe('Shanghai-Suzhou Route Validation', () => {
  let db;

  beforeAll((done) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) done(err);
      else done();
    });
  });

  afterAll((done) => {
    db.close();
    done();
  });

  const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  const getOne = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  test('Shanghai and Suzhou stations should exist', async () => {
    const stations = await query(`
      SELECT city, COUNT(*) as count 
      FROM rf_stations 
      WHERE city IN ('上海', '苏州') 
      GROUP BY city
    `);
    
    const sh = stations.find(s => s.city === '上海');
    const sz = stations.find(s => s.city === '苏州');
    
    expect(sh).toBeDefined();
    expect(sh.count).toBeGreaterThanOrEqual(4); // At least 4 stations
    expect(sz).toBeDefined();
    expect(sz.count).toBeGreaterThanOrEqual(4);
  });

  test('Should have trains between Shanghai and Suzhou for next 15 days', async () => {
    // Check coverage
    const res = await query(`
        SELECT travel_date, COUNT(*) as train_count
        FROM rf_inventories inv
        JOIN rf_stations fs ON inv.from_station_id = fs.station_id
        JOIN rf_stations ts ON inv.to_station_id = ts.station_id
        WHERE fs.city = '上海' AND ts.city = '苏州'
        GROUP BY travel_date
    `);
    
    console.log(`Coverage Days (SH->SZ): ${res.length}`);
    expect(res.length).toBeGreaterThanOrEqual(15);
    res.forEach(day => {
        expect(day.train_count).toBeGreaterThan(0);
    });
  });

  test('Should cover all 4 time slots', async () => {
    const slots = [
        { start: 0, end: 6, count: 0 },
        { start: 6, end: 12, count: 0 },
        { start: 12, end: 18, count: 0 },
        { start: 18, end: 24, count: 0 }
    ];

    const trains = await query(`
        SELECT dep.departure_time
        FROM rf_trains tr
        JOIN rf_stations fs ON tr.origin_station_id = fs.station_id
        JOIN rf_stations ts ON tr.destination_station_id = ts.station_id
        JOIN rf_timetables dep ON dep.train_id = tr.train_id AND dep.station_id = tr.origin_station_id
        WHERE fs.city = '上海' AND ts.city = '苏州'
    `);

    trains.forEach(t => {
        const [h, m] = t.departure_time.split(':').map(Number);
        if (h < 6) slots[0].count++;
        else if (h < 12) slots[1].count++;
        else if (h < 18) slots[2].count++;
        else slots[3].count++;
    });

    console.log('Time Slot Distribution:', slots);
    slots.forEach(slot => {
        expect(slot.count).toBeGreaterThan(0);
    });
  });

  test('Fares should be reasonable for SH-SZ distance (~80km)', async () => {
      const fares = await query(`
        SELECT f.base_price, f.seat_type, tr.train_type
        FROM rf_fares f
        JOIN rf_trains tr ON f.train_id = tr.train_id
        JOIN rf_stations fs ON tr.origin_station_id = fs.station_id
        JOIN rf_stations ts ON tr.destination_station_id = ts.station_id
        WHERE fs.city = '上海' AND ts.city = '苏州' AND f.seat_type = '二等座'
        LIMIT 10
      `);
      
      fares.forEach(f => {
          // G-train 2nd class approx 35-40 RMB for 80km
          // D-train approx 25-30
          // K-train Hard Seat approx 15
          if (f.train_type === 'G') {
              expect(f.base_price).toBeGreaterThan(20);
              expect(f.base_price).toBeLessThan(100);
          }
      });
  });
});
