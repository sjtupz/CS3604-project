const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'backend/data/12306.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database.');
});

db.serialize(() => {
  // 列出所有表
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Tables:', tables.map(t => t.name));

    // 检查 users 表
    if (tables.find(t => t.name === 'users')) {
      db.all("SELECT * FROM users LIMIT 5", [], (err, rows) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Users (first 5):', rows);
        }
        db.close();
      });
    } else {
      console.log('Table "users" does not exist.');
      db.close();
    }
  });
});
