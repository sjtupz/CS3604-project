import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

// Use verbose mode for better error messages
const sql = sqlite3.verbose();

const DB_PATH = path.join(__dirname, '../data/12306.db');
const OUTPUT_PATH = path.join(__dirname, '../../mock_data/train_list_mock.json');

// Open database
const db = new sql.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
});

function all(query: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function exportData() {
  console.log('Exporting mock data...');

  // Ensure output directory exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Query joined data
  // Get 500 tickets. We prioritize diversity.
  const querySql = `
    SELECT 
      t.train_number, t.train_type,
      tk.date,
      tk.departure_time, tk.arrival_time, tk.duration,
      tk.swz_num, tk.swz_price,
      tk.yd_num, tk.yd_price,
      tk.ed_num, tk.ed_price,
      tk.rw_num, tk.rw_price,
      tk.yw_num, tk.yw_price,
      tk.yz_num, tk.yz_price,
      tk.wz_num, tk.wz_price,
      fs.name as from_station_name,
      ts.name as to_station_name
    FROM tickets tk
    JOIN trains t ON tk.train_id = t.id
    JOIN stations fs ON tk.from_station_id = fs.id
    JOIN stations ts ON tk.to_station_id = ts.id
    LIMIT 500
  `;

  try {
    const rows = await all(querySql);
    
    if (rows.length === 0) {
      console.warn('No data found in database! Make sure you ran "npm run seed:all" first.');
      return;
    }

    const formatted = rows.map(r => ({
      trainNumber: r.train_number,
      trainType: r.train_type,
      date: r.date,
      departureStation: r.from_station_name,
      arrivalStation: r.to_station_name,
      departureTime: r.departure_time,
      arrivalTime: r.arrival_time,
      duration: r.duration,
      arrivalDayIndicator: r.arrival_time < r.departure_time ? '次日到达' : '当日到达',
      price: Math.min(
        ...[r.swz_price, r.yd_price, r.ed_price, r.rw_price, r.yw_price, r.yz_price].filter(p => p > 0)
      ) || 0,
      seatAvailability: {
        '商务座': { remaining: r.swz_num, price: r.swz_price },
        '一等座': { remaining: r.yd_num, price: r.yd_price },
        '二等座': { remaining: r.ed_num, price: r.ed_price },
        '软卧': { remaining: r.rw_num, price: r.rw_price },
        '硬卧': { remaining: r.yw_num, price: r.yw_price },
        '硬座': { remaining: r.yz_num, price: r.yz_price },
        '无座': { remaining: r.wz_num, price: r.wz_price }
      }
    }));

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(formatted, null, 2));
    console.log(`Successfully exported ${formatted.length} records to ${OUTPUT_PATH}`);

    // Statistics
    const types: Record<string, number> = formatted.reduce((acc: any, cur: any) => {
      acc[cur.trainType] = (acc[cur.trainType] || 0) + 1;
      return acc;
    }, {});
    console.log('Train Type Distribution:', types);

  } catch (err) {
    console.error('Export failed:', err);
  }
}

exportData().catch(console.error).finally(() => db.close());
