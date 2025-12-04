const db = require('../config/database');

const ensureLoginCodesTable = () => {
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

const createLoginCodeRecord = async (record) => {
  const { phone, identifier, code, createdAt, valid = 1 } = record;
  await ensureLoginCodesTable();
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO login_codes (phone, identifier, code, createdAt, valid) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [phone, identifier, code, createdAt, valid], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
};

module.exports = { createLoginCodeRecord, ensureLoginCodesTable };
