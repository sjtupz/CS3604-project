const { createLoginCodeRecord } = require('../db/createLoginCodeRecord');
const userDb = require('../db/userDb');
const { generateSixDigitCode } = require('../utils/validators');

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
  const code = providedCode || generateSixDigitCode();
  const phoneValue = /^\d{11}$/.test(identifier) ? identifier : null;
  await createLoginCodeRecord({
    phone: phoneValue,
    identifier,
    code,
    createdAt: Date.now(),
    valid: 1,
  });
  return { message: '获取手机验证码成功！' };
};

module.exports = { handleSendCode, resolveUserByIdentifier };
