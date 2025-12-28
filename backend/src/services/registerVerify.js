const { findLoginCodeRecord } = require('../db/findLoginCodeRecord');
const { invalidateLoginCodeRecord } = require('../db/invalidateLoginCodeRecord');
const userDb = require('../db/userDb');
const authService = require('./authService');
const passengerDb = require('../db/passenger');

async function handleRegisterVerify(payload) {
  const { phoneNumber, code, username, password, identityType, fullName, identityNumber, passengerType, email } = payload || {};

  if (!code) {
    const e = new Error('请输入验证码');
    e.status = 400;
    throw e;
  }

  const byPhone = await findLoginCodeRecord({ identifier: phoneNumber });
  const byUsername = username ? await findLoginCodeRecord({ identifier: username }) : null;
  const record = [byPhone, byUsername].filter(Boolean).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0] || null;
  if (!record || record.valid === 0 || record.code !== code) {
    const e = new Error('验证码校验失败');
    e.status = 401;
    throw e;
  }

  const required = [username, password, identityType, fullName, identityNumber, passengerType];
  if (required.some((v) => !v || String(v).trim() === '')) {
    const e = new Error('请输入正确的用户信息！');
    e.status = 422;
    throw e;
  }
  const userData = { username, password, identityType, fullName, identityNumber, passengerType, email, phoneNumber };
  const existingByUsername = await userDb.findUserByUsername(username);
  const existingByPhone = await userDb.findUserByPhoneNumber(phoneNumber);
  const existingByIdentity = await userDb.findUserByIdentityNumber(identityNumber);

  if (!existingByUsername && !existingByPhone && !existingByIdentity) {
    const result = await authService.registerUser(userData);
    
    // Auto create passenger
    try {
      if (fullName && identityNumber) {
        await passengerDb.createPassenger(result.id, {
          name: fullName,
          idType: identityType || '中国居民身份证',
          idNumber: identityNumber,
          phone: phoneNumber,
          discountType: passengerType || '成人'
        });
      }
    } catch (passErr) {
      console.warn('Failed to auto-create passenger record in verify:', passErr);
    }
  }

  await invalidateLoginCodeRecord({ identifier: record.identifier });

  return { message: 'Registration successful, please proceed to login.' };
}

module.exports = { handleRegisterVerify };
