const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../data/12306.db');
const db = new sqlite3.Database(DB_PATH);

function pad(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
}

const verify = async () => {
  console.log('Verifying test data...');

  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 14);

  const startDateStr = formatDate(today);
  const endDateStr = formatDate(endDate);

  console.log(`Expected Date Range: ${startDateStr} to ${endDateStr}`);

  db.serialize(() => {
    // Check Total Count
    db.get("SELECT COUNT(*) as count FROM train_tickets", (err, row) => {
      if (err) console.error(err);
      console.log(`Total Records: ${row.count}`);
    });

    // Check Date Range
    db.all("SELECT DISTINCT date FROM train_tickets ORDER BY date", (err, rows) => {
      if (err) console.error(err);
      console.log(`Date Coverage (${rows.length} days):`);
      if (rows.length > 0) {
        console.log(`Min Date: ${rows[0].date}`);
        console.log(`Max Date: ${rows[rows.length - 1].date}`);
      }
      
      const missingDates = [];
      for (let i = 0; i < 15; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dStr = formatDate(d);
        if (!rows.find(r => r.date === dStr)) {
          missingDates.push(dStr);
        }
      }
      if (missingDates.length > 0) {
        console.error('Missing Dates:', missingDates);
      } else {
        console.log('All dates covered.');
      }
    });

    // Check Station Coverage Sample
    db.all("SELECT start_station, COUNT(*) as count FROM train_tickets GROUP BY start_station", (err, rows) => {
      if (err) console.error(err);
      console.log(`Station Coverage (${rows.length} stations):`);
      const lowCoverage = rows.filter(r => r.count < 10);
      if (lowCoverage.length > 0) {
        console.log('Stations with low coverage (<10):', lowCoverage);
      } else {
        console.log('All stations have >= 10 records.');
      }
    });

    // Check Time Slot Coverage for a sample date/station
    db.all(`
      SELECT 
        CASE 
          WHEN start_time BETWEEN '00:00' AND '06:00' THEN '0-6'
          WHEN start_time BETWEEN '06:00' AND '12:00' THEN '6-12'
          WHEN start_time BETWEEN '12:00' AND '18:00' THEN '12-18'
          WHEN start_time BETWEEN '18:00' AND '24:00' THEN '18-24'
        END as slot,
        COUNT(*) as count
      FROM train_tickets
      WHERE date = ?
      GROUP BY slot
    `, [startDateStr], (err, rows) => {
      if (err) console.error(err);
      console.log(`Time Slot Distribution for ${startDateStr}:`);
      rows.forEach(r => console.log(`${r.slot}: ${r.count}`));
    });
  });
};

verify().catch(console.error);
