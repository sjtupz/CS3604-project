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

const invalidateLoginCodeRecord = async (query) => {
  const { identifier } = query;
  await ensureTable();
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE login_codes SET valid = 0 WHERE identifier = ?';
    db.run(sql, [identifier], function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
};

module.exports = { invalidateLoginCodeRecord };
