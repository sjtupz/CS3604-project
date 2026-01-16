const sqlite3 = require('sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/12306.db');
const db = new sqlite3.Database(DB_PATH);

db.all(`
  SELECT 
    t.train_number, 
    t.train_type,
    os.name as origin, 
    ds.name as dest,
    inv.travel_date,
    inv.second_remaining
  FROM rf_trains t
  JOIN rf_stations os ON t.origin_station_id = os.station_id
  JOIN rf_stations ds ON t.destination_station_id = ds.station_id
  JOIN rf_inventories inv ON t.train_id = inv.train_id
  WHERE os.city = '上海' AND ds.city = '北京'
  LIMIT 10
`, (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} trains from Shanghai to Beijing.`);
    console.log(JSON.stringify(rows, null, 2));
  }
});
