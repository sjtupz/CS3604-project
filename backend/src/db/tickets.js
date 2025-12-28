const { getDb } = require('./personal_database');

// Helper to promisify db.run
function run(sql, params = []) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

// Helper to promisify db.all
function all(sql, params = []) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function insertTrainTickets(records) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      const stmt = db.prepare(`INSERT INTO train_tickets (
        train_no, train_type, start_station, end_station,
        start_time, end_time, duration, date,
        swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

      for (const r of records) {
        stmt.run([
          r.train_no, r.train_type, r.start_station, r.end_station,
          r.start_time, r.end_time, r.duration, r.date,
          r.swz_num, r.yd_num, r.ed_num, r.rw_num, r.yw_num, r.yz_num, r.wz_num
        ], (err) => {
            if (err) console.error('Insert error:', err);
        });
      }
      stmt.finalize();
      db.run('COMMIT', (err) => {
          if (err) reject(err);
          else resolve();
      });
    });
  });
}

async function findTickets({ start_station, end_station, date }) {
  console.log(`[DEBUG] findTickets: ${start_station} -> ${end_station} on ${date}`);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  const db = getDb();
  await new Promise(r => {
    db.all('PRAGMA table_info(train_tickets)', (err, rows) => {
        console.log('Table Info:', rows);
        r();
    });
  });

  // [FIX] Use Fuzzy Match for Station and Date Prefix to handle format mismatches
  const sql = `
    SELECT 
      id, train_no, train_type, start_station, end_station, 
      start_time, end_time, duration, date,
      swz_num as swz, yd_num as yd, ed_num as ed, 
      rw_num as rw, yw_num as yw, yz_num as yz, wz_num as wz 
    FROM train_tickets 
    WHERE start_station LIKE ? 
      AND end_station LIKE ? 
      AND date LIKE ? 
    ORDER BY start_time ASC
  `;

  const params = [`%${start_station}%`, `%${end_station}%`, `${date}%`];

  // [DEBUG] Log SQL and Params
  console.log("Executing SQL:", sql.replace(/\s+/g, ' ').trim());
  console.log("SQL Params:", params);

  try {
    const rows = await all(sql, params);
    
    // [DEBUG] Log DB Raw Result
    console.log("DB Raw Result Length:", rows.length);
    if (rows.length > 0) {
      console.log("DB Raw Result Sample:", rows[0]);
    } else {
      console.log("DB Raw Result is empty []");
      
      // [DEBUG] Check Data Format Sample (if result is empty)
      try {
          const sampleRows = await all("SELECT start_station, date FROM train_tickets LIMIT 1");
          if (sampleRows && sampleRows.length > 0) {
              console.log("DB DATA FORMAT SAMPLE - Station:", sampleRows[0].start_station);
              console.log("DB DATA FORMAT SAMPLE - Date:", sampleRows[0].date);
          } else {
              console.log("DB DATA FORMAT SAMPLE - Table is empty");
          }
      } catch (e) {
          console.error("[DEBUG] Failed to query sample data:", e);
      }
    }

    console.log(`[DEBUG] findTickets result count: ${rows.length}`);
    return rows;
  } catch (err) {
    console.error('findTickets error:', err);
    return [];
  }
}

async function listTickets(query) {
  const { date, from, to, filterType, filterStationIn, filterStationOut, filterTimeStr } = query || {};
  console.log('[DEBUG] listTickets query:', query);

  let sql = 'SELECT * FROM train_tickets WHERE 1=1';
  const params = [];

  if (date) {
    sql += ' AND date = ?';
    params.push(date);
  }
  if (from) {
    sql += ' AND start_station LIKE ?';
    params.push(`%${from}%`);
  }
  if (to) {
    sql += ' AND end_station LIKE ?';
    params.push(`%${to}%`);
  }

  // [DEBUG] Log SQL and Params
  console.log("Executing SQL:", sql);
  console.log("SQL Params:", params);

  // Add more filters if needed (filterType etc.)
  // For now, supporting the basic "return all" if no params, or basic filtering.

  try {
    const rows = await all(sql, params);
    console.log(`[DEBUG] listTickets found ${rows.length} rows`);
    return rows;
  } catch (err) {
    console.error('[DEBUG] listTickets error:', err);
    return [];
  }
}

module.exports = { insertTrainTickets, findTickets, listTickets };
