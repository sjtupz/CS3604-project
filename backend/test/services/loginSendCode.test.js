const { handleSendCode } = require('../../src/services/loginSendCode');

describe('Service: loginSendCode', () => {
  test('Given matched user and idLast4 When sending code Then returns success and logs', async () => {
    const result = await handleSendCode({ identifier: '13800138000', idLast4: '0000' });
    expect(result).toEqual({ message: '获取手机验证码成功！' });
  });
});
