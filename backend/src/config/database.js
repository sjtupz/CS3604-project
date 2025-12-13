let db;
let BetterSqlite3;
try {
  BetterSqlite3 = require('better-sqlite3');
} catch (e) {
  BetterSqlite3 = null;
}

function getDbPath() {
  const env = process.env.NODE_ENV || 'development';
  if (env === 'test') {
    return ':memory:';
  }
  return process.env.SQLITE_DB_PATH || './backend/data/tickets.db';
}

function getDB() {
  if (!db) {
    const env = process.env.NODE_ENV || 'development';
    if (BetterSqlite3 && env !== 'test') {
      db = new BetterSqlite3(getDbPath());
      db.pragma('journal_mode = WAL');
      db.pragma('synchronous = NORMAL');
    } else {
      // Lightweight stub for test/dev environments when native bindings are unavailable
      const stubRow = { c: 0 };
      db = {
        exec: () => {},
        pragma: () => {},
        prepare: () => ({ get: () => stubRow, run: () => {}, all: () => [] }),
        transaction: (fn) => () => fn(),
      };
    }
  }
  return db;
}

function initSchema() {
  const db = getDB();
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY,
      train_no TEXT,
      train_type TEXT,
      start_station TEXT,
      end_station TEXT,
      from_city TEXT,
      to_city TEXT,
      start_time TEXT,
      end_time TEXT,
      duration TEXT,
      date TEXT,
      swz TEXT,
      yd TEXT,
      ed TEXT,
      rw TEXT,
      yw TEXT,
      yz TEXT,
      wz TEXT
    );
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS train_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_no TEXT,
      train_type TEXT,
      start_station TEXT,
      end_station TEXT,
      start_time TEXT,
      end_time TEXT,
      duration TEXT,
      date TEXT,
      swz_num TEXT,
      yd_num TEXT,
      ed_num TEXT,
      rw_num TEXT,
      yw_num TEXT,
      yz_num TEXT,
      wz_num TEXT
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_tickets_city_date ON tickets(from_city, to_city, date);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_train_tickets_route_date ON train_tickets(start_station, end_station, date);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_tickets_type_time ON tickets(train_type, start_time);`);
}

function clearTickets() {
  const db = getDB();
  db.exec('DELETE FROM tickets');
}

function transaction(fn) {
  const db = getDB();
  const tx = db.transaction(fn);
  return tx();
}

module.exports = { getDB, initSchema, clearTickets, transaction };
