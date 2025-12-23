const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/12306.db');

describe('Database Query Performance', () => {
  let db;

  beforeAll((done) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Failed to connect to database', err);
        done(err);
      } else {
        done();
      }
    });
  });

  afterAll((done) => {
    db.close((err) => {
      if (err) console.error('Failed to close database', err);
      done();
    });
  });

  const query = (sql, params = []) => new Promise((resolve, reject) => {
    const start = process.hrtime();
    db.all(sql, params, (err, rows) => {
      const end = process.hrtime(start);
      const durationMs = (end[0] * 1000 + end[1] / 1e6);
      if (err) reject(err);
      else resolve({ rows, durationMs });
    });
  });

  const getOne = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  test('Search Trains (Real Existing Route) should be fast', async () => {
    // 1. Get a valid date
    const dateRes = await query('SELECT MAX(travel_date) as d FROM rf_inventories');
    const validDate = dateRes.rows[0].d;

    // 2. Find a route that actually exists
    const route = await getOne(`
      SELECT os.name as from_station, ds.name as to_station
      FROM rf_trains tr
      JOIN rf_stations os ON os.station_id = tr.origin_station_id
      JOIN rf_stations ds ON ds.station_id = tr.destination_station_id
      LIMIT 1
    `);

    if (!route) {
      console.warn('No routes found in DB, skipping perf test for search.');
      return;
    }

    const { from_station, to_station } = route;
    console.log(`[Perf] Testing Search for route: ${from_station} -> ${to_station} on ${validDate}`);

    const sql = `
        SELECT tr.train_id, tr.train_number, tr.train_type, tr.duration_minutes,
               os.name AS departureStation, os.city AS depCity,
               ds.name AS arrivalStation, ds.city AS arrCity,
               dep.departure_time AS departure_time,
               arr.arrival_time AS arrival_time
        FROM rf_trains tr
        JOIN rf_stations os ON os.station_id = tr.origin_station_id
        JOIN rf_stations ds ON ds.station_id = tr.destination_station_id
        LEFT JOIN rf_timetables dep ON dep.train_id = tr.train_id AND dep.station_id = tr.origin_station_id AND dep.stop_order = 1
        LEFT JOIN rf_timetables arr ON arr.train_id = tr.train_id AND arr.station_id = tr.destination_station_id AND arr.stop_order = tr.stop_count
        WHERE (os.name = ? OR os.city LIKE '%' || ? || '%') 
          AND (ds.name = ? OR ds.city LIKE '%' || ? || '%')
          AND EXISTS (SELECT 1 FROM rf_inventories inv WHERE inv.train_id = tr.train_id AND inv.travel_date = ?)
    `;
    
    const params = [from_station, from_station, to_station, to_station, validDate];
    
    // Warm up
    await query(sql, params);

    // Measure
    const result = await query(sql, params);
    console.log(`[Perf] Search Trains (Beijing->Shanghai): ${result.durationMs.toFixed(2)}ms, Rows: ${result.rows.length}`);
    
    // Threshold: < 200ms for the search query
    expect(result.durationMs).toBeLessThan(200);
    
    // Measure Detail Lookups (Inventory + Fare) for each train
    if (result.rows.length > 0) {
        let totalDetailTime = 0;
        
        for (const row of result.rows) {
            const invSql = `SELECT * FROM rf_inventories WHERE train_id = ? AND travel_date = ?`;
            const fareSql = `SELECT base_price FROM rf_fares WHERE train_id = ? AND seat_type = '二等' LIMIT 1`;
            
            const invRes = await query(invSql, [row.train_id, validDate]);
            const fareRes = await query(fareSql, [row.train_id]);
            
            totalDetailTime += invRes.durationMs + fareRes.durationMs;
        }
        
        const avgDetailTime = totalDetailTime / result.rows.length;
        console.log(`[Perf] Average Detail Lookup per Train: ${avgDetailTime.toFixed(2)}ms`);
        console.log(`[Perf] Total Detail Lookup Time: ${totalDetailTime.toFixed(2)}ms`);

        // Threshold: < 10ms per train for details (SQLite is fast)
        expect(avgDetailTime).toBeLessThan(10);
    }
  });

  test('Station Autocomplete should be extremely fast', async () => {
    const sql = `SELECT * FROM rf_stations WHERE name LIKE ? OR pinyin LIKE ? LIMIT 10`;
    const params = ['北京%', 'bj%'];
    
    const result = await query(sql, params);
    console.log(`[Perf] Station Autocomplete: ${result.durationMs.toFixed(2)}ms`);
    
    // Threshold: < 50ms
    expect(result.durationMs).toBeLessThan(50);
  });
});
