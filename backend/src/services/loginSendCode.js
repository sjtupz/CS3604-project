const { createLoginCodeRecord } = require('../db/createLoginCodeRecord');
const userDb = require('../db/userDb');
const { generateSixDigitCode } = require('../utils/validators');

const resolveUserByIdentifier = async (identifierRaw) => {
  const identifier = identifierRaw ? String(identifierRaw).trim() : '';
  if (!identifier) return null;

  if (/^\d{11}$/.test(identifier)) {
    const user = await userDb.findUserByPhoneNumber(identifier);
    if (user) return user;
  }
  if (/.+@.+\..+/.test(identifier)) {
    const user = await userDb.findUserByEmail(identifier);
    if (user) return user;
  }
  // Try ID card
  if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(identifier)) {
    const user = await userDb.findUserByIdentityNumber(identifier);
    if (user) return user;
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
