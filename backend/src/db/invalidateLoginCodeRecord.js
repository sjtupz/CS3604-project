const { run } = require('./personal_database');

const invalidateLoginCodeRecord = async (query) => {
  const { identifier } = query;
  const sql = 'UPDATE login_codes SET valid = 0 WHERE identifier = ?';
  const result = await run(sql, [identifier]);
  return { changes: result.changes };
};

module.exports = { invalidateLoginCodeRecord };
