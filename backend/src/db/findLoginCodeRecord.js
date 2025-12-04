const { get } = require('./personal_database');

const findLoginCodeRecord = async (query) => {
  const { identifier } = query;
  const sql = 'SELECT * FROM login_codes WHERE identifier = ? ORDER BY createdAt DESC LIMIT 1';
  const row = await get(sql, [identifier]);
  return row || null;
};

module.exports = { findLoginCodeRecord };
