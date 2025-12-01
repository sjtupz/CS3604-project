const db = require('../config/database');

const { ensureLoginCodesTable } = require('./createLoginCodeRecord');

const invalidateLoginCodeRecord = async (query) => {
  const { identifier } = query;
  await ensureLoginCodesTable();
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE login_codes SET valid = 0 WHERE identifier = ?';
    db.run(sql, [identifier], function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
};

module.exports = { invalidateLoginCodeRecord };
