const { createLoginCodeRecord } = require('../db/createLoginCodeRecord');
const { isValidPhone, generateSixDigitCode } = require('../utils/validators');

async function handleRegisterSendCode(payload) {
  const { phoneNumber } = payload || {};
  if (!isValidPhone(phoneNumber)) {
    const e = new Error('请输入正确的用户信息！');
    e.status = 422;
    throw e;
  }

  const code = generateSixDigitCode();
  await createLoginCodeRecord({
    phone: phoneNumber,
    identifier: phoneNumber,
    code,
    createdAt: Date.now(),
    valid: 1,
  });

  console.log(`[DEV] 发送注册验证码到 +86 ${phoneNumber}: CODE=${code}`);

  return { message: '获取手机验证码成功！' };
}

module.exports = { handleRegisterSendCode };
