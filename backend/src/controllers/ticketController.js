
const sqlite3 = require('sqlite3');
const path = require('path');

// Database setup
const DB_PATH = path.join(__dirname, '../../data/task_12306.db');
const db = new sqlite3.Database(DB_PATH);

// Helper for query (Promisified)
const query = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

const searchTickets = async (req, res) => {
  try {
    // 1. Input Parameters
    const { 
      from_station, 
      to_station, 
      date, 
      train_type, 
      only_available,
      seat_type,
      dep_time_min,
      dep_time_max,
      arr_time_min,
      arr_time_max,
      price_min,
      price_max,
      duration_min,
      duration_max
    } = req.query;

    if (!from_station || !to_station || !date) {
      return res.status(400).json({ error: 'Missing required parameters: from_station, to_station, date' });
    }

    // 2. Build SQL Query
    // We join trains, schedules, tickets, and stations twice (for from/to)
    let sql = `
      SELECT 
        T.id as train_id,
        T.train_number,
        T.type as train_type,
        FromS.name as from_station_name,
        ToS.name as to_station_name,
        S.departure_time,
        S.arrival_time,
        S.status as train_status,
        K.seat_type,
        K.price,
        K.count
      FROM tickets K
      JOIN schedules S ON K.schedule_id = S.id
      JOIN trains T ON S.train_id = T.id
      JOIN stations FromS ON S.from_station_id = FromS.id
      JOIN stations ToS ON S.to_station_id = ToS.id
      WHERE 
        K.date = ? 
        AND FromS.name = ? 
        AND ToS.name = ?
    `;

    const params = [date, from_station, to_station];

    // --- Dynamic Filters ---

    // Train Type (support multiple, e.g. "G,D")
    if (train_type) {
      const types = train_type.split(',');
      const placeholders = types.map(() => '?').join(',');
      sql += ` AND T.type IN (${placeholders})`;
      params.push(...types);
    }

    // Seat Type (support multiple)
    if (seat_type) {
      const seats = seat_type.split(',');
      const placeholders = seats.map(() => '?').join(',');
      sql += ` AND K.seat_type IN (${placeholders})`;
      params.push(...seats);
    }

    // Departure Time Range
    if (dep_time_min) {
      sql += ` AND S.departure_time >= ?`;
      params.push(dep_time_min); // Expect format HH:mm
    }
    if (dep_time_max) {
      sql += ` AND S.departure_time <= ?`;
      params.push(dep_time_max);
    }

    // Arrival Time Range
    if (arr_time_min) {
      sql += ` AND S.arrival_time >= ?`;
      params.push(arr_time_min);
    }
    if (arr_time_max) {
      sql += ` AND S.arrival_time <= ?`;
      params.push(arr_time_max);
    }

    // Price Range
    if (price_min) {
      sql += ` AND K.price >= ?`;
      params.push(Number(price_min));
    }
    if (price_max) {
      sql += ` AND K.price <= ?`;
      params.push(Number(price_max));
    }

    // Execute Query
    const rows = await query(sql, params);

    // 3. Process & Aggregate Data
    const trainsMap = new Map();

    for (const row of rows) {
      // Calculate duration
      // Note: This duration logic is simple and assumes format HH:mm:ss
      // If arrival < departure, we assume +1 day.
      const dep = new Date(`1970-01-01T${row.departure_time}Z`);
      const arr = new Date(`1970-01-01T${row.arrival_time}Z`);
      if (arr < dep) {
        arr.setDate(arr.getDate() + 1);
      }
      const diffMs = arr.getTime() - dep.getTime();
      const diffHrs = diffMs / 3600000; // Float hours
      
      // Duration Filter (in JS)
      if (duration_min && diffHrs < Number(duration_min)) continue;
      if (duration_max && diffHrs > Number(duration_max)) continue;

      const durationStr = `${Math.floor(diffHrs).toString().padStart(2, '0')}:${Math.floor((diffMs % 3600000) / 60000).toString().padStart(2, '0')}`;

      if (!trainsMap.has(row.train_id)) {
        trainsMap.set(row.train_id, {
          trainId: row.train_id,
          trainNumber: row.train_number,
          type: row.train_type,
          fromStation: row.from_station_name,
          toStation: row.to_station_name,
          departureTime: row.departure_time.substring(0, 5), // HH:mm
          arrivalTime: row.arrival_time.substring(0, 5),     // HH:mm
          duration: durationStr,
          status: row.train_status || 'Normal', // Default to Normal if missing
          tickets: []
        });
      }

      trainsMap.get(row.train_id).tickets.push({
        seatType: row.seat_type,
        price: row.price,
        count: row.count
      });
    }

    let results = Array.from(trainsMap.values());

    // 4. Filter "Only Available" (In-memory filtering)
    if (only_available === 'true' || only_available === '1') {
      results = results.filter(train => train.tickets.some(t => t.count > 0));
    }

    // 5. Response
    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Search Tickets Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { searchTickets };
