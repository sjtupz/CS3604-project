const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'backend/data/12306.db');
console.log('Opening DB:', DB_PATH);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

db.serialize(() => {
  db.get("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='train_tickets'", (err, row) => {
      if (err) {
          console.error("Error checking table existence:", err);
          return;
      }
      if (!row || row.count === 0) {
          console.log("Table 'train_tickets' does NOT exist.");
          db.close();
      } else {
          console.log("Table 'train_tickets' exists.");
          db.get("SELECT count(*) as count FROM train_tickets", (err, row) => {
              if (err) console.error(err);
              console.log("Row count in train_tickets:", row ? row.count : 'N/A');
              
              if (row && row.count > 0) {
                  db.all("SELECT * FROM train_tickets LIMIT 3", (err, rows) => {
                      console.log("Sample rows:", rows);
                      db.close();
                  });
              } else {
                  db.close();
              }
          });
      }
  });
});
