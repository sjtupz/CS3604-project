const db = require('../config/database');

const ensureTable = () => {
  return new Promise((resolve, reject) => {
    const ddl = `CREATE TABLE IF NOT EXISTS login_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT,
      identifier TEXT,
      code TEXT,
      createdAt INTEGER,
      valid INTEGER DEFAULT 1
    )`;
    db.run(ddl, [], (err) => (err ? reject(err) : resolve(null)));
  });
};

const findLoginCodeRecord = async (query) => {
  const { identifier } = query;
  await ensureTable();
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM login_codes WHERE identifier = ? ORDER BY createdAt DESC LIMIT 1';
    db.get(sql, [identifier], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
};

module.exports = { findLoginCodeRecord };
