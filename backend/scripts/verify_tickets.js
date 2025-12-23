const { getDb } = require('../src/db/personal_database');

(async () => {
  const db = getDb();
  
  console.log('Verifying ticket data...');
  
  // 1. Check Total Count
  const count = await new Promise(r => db.get("SELECT count(*) as c FROM train_tickets", (err, row) => r(row.c)));
  console.log(`Total tickets: ${count}`);
  
  // 2. Check for NULLs in critical fields
  const nulls = await new Promise(r => db.get(`
    SELECT count(*) as c FROM train_tickets 
    WHERE train_no IS NULL 
       OR start_station IS NULL 
       OR end_station IS NULL 
       OR date IS NULL
  `, (err, row) => r(row.c)));
  
  if (nulls > 0) {
    console.error(`Found ${nulls} rows with NULL critical fields!`);
  } else {
    console.log('Integrity Check: PASS (No NULL critical fields)');
  }
  
  // 3. Check Date Range
  const dateRange = await new Promise(r => db.get("SELECT min(date) as min, max(date) as max FROM train_tickets", (err, row) => r(row)));
  console.log(`Date Range: ${dateRange.min} to ${dateRange.max}`);
  
  // 4. Check Train Type Distribution
  console.log('Train Type Distribution:');
  const types = await new Promise(r => db.all("SELECT train_type, count(*) as c FROM train_tickets GROUP BY train_type", (err, rows) => r(rows)));
  types.forEach(row => console.log(`  ${row.train_type}: ${row.c}`));
  
  // 5. Check Time Slot Distribution (Roughly)
  console.log('Time Distribution (Hour):');
  // SQLite substr(start_time, 1, 2) to get hour
  const hours = await new Promise(r => db.all("SELECT substr(start_time, 1, 2) as h, count(*) as c FROM train_tickets GROUP BY h ORDER BY h", (err, rows) => r(rows)));
  // Group into 4 slots for display
  const slots = { '00-06': 0, '06-12': 0, '12-18': 0, '18-24': 0 };
  hours.forEach(row => {
      const h = parseInt(row.h);
      if (h < 6) slots['00-06'] += row.c;
      else if (h < 12) slots['06-12'] += row.c;
      else if (h < 18) slots['12-18'] += row.c;
      else slots['18-24'] += row.c;
  });
  console.log('  00:00-06:00:', slots['00-06']);
  console.log('  06:00-12:00:', slots['06-12']);
  console.log('  12:00-18:00:', slots['12-18']);
  console.log('  18:00-24:00:', slots['18-24']);

  // 6. Check for duplicate train_no per day
  const dups = await new Promise(r => db.all(`
      SELECT train_no, date, count(*) as c
      FROM train_tickets 
      GROUP BY train_no, date 
      HAVING count(*) > 1
      LIMIT 10
  `, (err, rows) => r(rows)));
  
  if (dups && dups.length > 0) {
      console.error(`Found duplicates (showing first 10):`);
      dups.forEach(d => console.log(`  ${d.date} - ${d.train_no}: ${d.c} times`));
  } else {
      console.log('Uniqueness Check: PASS (No duplicate trains per day)');
  }

  process.exit(0);
})();
