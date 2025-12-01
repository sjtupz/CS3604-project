const db = require('../config/database');

const { ensureLoginCodesTable } = require('./createLoginCodeRecord');

const findLoginCodeRecord = async (query) => {
  const { identifier } = query;
  await ensureLoginCodesTable();
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM login_codes WHERE identifier = ? ORDER BY createdAt DESC LIMIT 1';
    db.get(sql, [identifier], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
};

module.exports = { findLoginCodeRecord };
