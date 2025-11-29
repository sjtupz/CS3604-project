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

const handleSendCode = async (payload) => {
  const { identifier, idLast4, code: providedCode } = payload || {};
  const code = providedCode || String(Math.floor(100000 + Math.random() * 900000));
  await ensureTable();
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO login_codes (phone, identifier, code, createdAt, valid) VALUES (?, ?, ?, ?, ?)';
    const phoneValue = /^\d{11}$/.test(identifier) ? identifier : null;
    db.run(sql, [phoneValue, identifier, code, Date.now(), 1], function (err) {
      if (err) return reject(err);
      resolve({ message: '获取手机验证码成功！' });
    });
  });
};

module.exports = { handleSendCode };
