const { createLoginCodeRecord } = require('../db/createLoginCodeRecord');
const userDb = require('../db/userDb');

const resolveUserByIdentifier = async (identifier) => {
  if (/^\d{11}$/.test(identifier)) {
    return await userDb.findUserByPhoneNumber(identifier);
  }
  if (/.+@.+\..+/.test(identifier)) {
    return await userDb.findUserByEmail(identifier);
  }
  return await userDb.findUserByUsername(identifier);
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

module.exports = { handleSendCode, resolveUserByIdentifier };
