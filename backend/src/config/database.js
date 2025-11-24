// backend/src/config/database.js
const sqlite3 = require('sqlite3').verbose();

// 根据环境变量选择数据库文件
const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : 'database.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  const createUserTableSql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      identityType TEXT NOT NULL,
      fullName TEXT NOT NULL,
      identityNumber TEXT NOT NULL UNIQUE,
      passengerType TEXT NOT NULL,
      email TEXT UNIQUE,
      phoneNumber TEXT UNIQUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.run(createUserTableSql, (err) => {
    if (err) {
      console.error("Error creating user table", err.message);
    }
  });

  const createLoginCodesTableSql = `
    CREATE TABLE IF NOT EXISTS login_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT,
      identifier TEXT,
      code TEXT,
      createdAt INTEGER,
      valid INTEGER DEFAULT 1
    );
  `;
  db.run(createLoginCodesTableSql, (err) => {
    if (err) {
      console.error("Error creating login_codes table", err.message);
    }
  });
}

module.exports = db;
