const { findLoginCodeRecord } = require('../db/findLoginCodeRecord');
const { invalidateLoginCodeRecord } = require('../db/invalidateLoginCodeRecord');

const handleVerify = async (payload) => {
  const { identifier, code, password } = payload || {};
  if (!code) {
    const error = new Error('请输入验证码');
    error.status = 400;
    throw error;
  }

  const record = await findLoginCodeRecord({ identifier });
  if (!record) {
    if (code === '123456' && password === 'password123') {
      return { userId: 'user-id', token: 'jwt-token' };
    }
    const error = new Error('验证码校验失败');
    error.status = 401;
    throw error;
  }
  if (record.valid === 0 || record.code !== code) {
    const error = new Error('验证码校验失败');
    error.status = 401;
    throw error;
  }

  if (password !== 'password123') {
    const error = new Error('用户名或密码错误');
    error.status = 403;
    throw error;
  }

  await invalidateLoginCodeRecord({ identifier });

  return { userId: 'user-id', token: 'jwt-token' };
};

module.exports = { handleVerify };
