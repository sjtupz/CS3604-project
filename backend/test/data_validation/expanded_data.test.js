const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/12306.db');

describe('Expanded Data Validation', () => {
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

  describe('Station & City Coverage', () => {
    test('Should have a substantial number of cities and stations', async () => {
      const cityCount = await getOne('SELECT COUNT(*) as count FROM rf_cities');
      const stationCount = await getOne('SELECT COUNT(*) as count FROM rf_stations');

      console.log(`Cities: ${cityCount.count}, Stations: ${stationCount.count}`);
      expect(cityCount.count).toBeGreaterThan(100); // We expect > 300 based on PROVINCES list
      expect(stationCount.count).toBeGreaterThan(cityCount.count); // At least 1 station per city
    });

    test('All cities should have at least one station', async () => {
      const citiesWithoutStations = await query(`
        SELECT c.name 
        FROM rf_cities c 
        LEFT JOIN rf_stations s ON c.city_code = s.city_code 
        WHERE s.station_id IS NULL
      `);
      expect(citiesWithoutStations.length).toBe(0);
    });

    test('Major cities should have multiple stations', async () => {
      const majorCities = ['北京', '上海', '广州', '深圳'];
      for (const city of majorCities) {
        const result = await getOne(`
          SELECT COUNT(*) as count 
          FROM rf_stations 
          WHERE city = ?
        `, [city]);
        expect(result.count).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('Time Range Correctness', () => {
    test('Should cover 15 days of ticket data', async () => {
      const result = await getOne(`
        SELECT MIN(travel_date) as min_date, MAX(travel_date) as max_date, COUNT(DISTINCT travel_date) as day_count
        FROM rf_inventories
      `);
      
      console.log(`Date Range: ${result.min_date} to ${result.max_date} (${result.day_count} days)`);
      
      expect(result.day_count).toBeGreaterThanOrEqual(15);
      
      const min = new Date(result.min_date);
      const max = new Date(result.max_date);
      const diffTime = Math.abs(max - min);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      expect(diffDays).toBeGreaterThanOrEqual(14); // 15 days span is 14 days difference
    });

    test('Each day should have inventory records', async () => {
        const counts = await query(`
            SELECT travel_date, COUNT(*) as count 
            FROM rf_inventories 
            GROUP BY travel_date
        `);
        expect(counts.length).toBeGreaterThanOrEqual(15);
        counts.forEach(day => {
            expect(day.count).toBeGreaterThan(0);
        });
    });
  });

  describe('Data Rationality', () => {
    test('Fare to Distance ratio should be reasonable', async () => {
      // Join fares with trains to get distance and price
      const samples = await query(`
        SELECT f.base_price, t.distance_km, t.train_type
        FROM rf_fares f
        JOIN rf_trains t ON f.train_id = t.train_id
        WHERE t.distance_km > 0
        LIMIT 50
      `);

      expect(samples.length).toBeGreaterThan(0);

      samples.forEach(sample => {
        const ratio = sample.base_price / sample.distance_km;
        // High speed (G/D) usually 0.3-0.6, Ordinary (Z/T/K) usually 0.1-0.3
        // Allow a wide margin for randomness but ensure it's not free or insanely expensive
        expect(ratio).toBeGreaterThan(0.05); 
        expect(ratio).toBeLessThan(2.0);
      });
    });

    test('Train duration should match distance roughly', async () => {
        // Average speed check: 
        // G/D trains: 150 - 350 km/h
        // Z/T/K trains: 60 - 160 km/h
        const samples = await query(`
            SELECT train_type, distance_km, duration_minutes
            FROM rf_trains
            WHERE distance_km > 100
            LIMIT 20
        `);

        samples.forEach(sample => {
            const hours = sample.duration_minutes / 60;
            const speed = sample.distance_km / hours;
            
            if (['G', 'D'].includes(sample.train_type)) {
                expect(speed).toBeGreaterThan(50); // Minimal constraint for "fast"
                expect(speed).toBeLessThan(400);
            } else {
                expect(speed).toBeGreaterThan(30); // Minimal constraint for "slow"
                expect(speed).toBeLessThan(200);
            }
        });
    });
  });
});
