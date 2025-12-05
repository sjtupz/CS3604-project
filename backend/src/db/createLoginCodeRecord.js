const { run } = require('./personal_database');

const ensureLoginCodesTable = () => {
  // Table creation is handled in personal_database.js initializeDatabase
  return Promise.resolve();
};

const createLoginCodeRecord = async (record) => {
  const { phone, identifier, code, createdAt, valid = 1 } = record;
  // await ensureLoginCodesTable(); // No longer needed as init is handled centrally
  const sql = 'INSERT INTO login_codes (phone, identifier, code, createdAt, valid) VALUES (?, ?, ?, ?, ?)';
  const result = await run(sql, [phone, identifier, code, createdAt, valid]);
  return { id: result.lastID };
};

module.exports = { createLoginCodeRecord, ensureLoginCodesTable };
