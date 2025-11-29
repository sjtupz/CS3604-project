const { handleVerify } = require('../../src/services/loginVerify');

describe('Service: loginVerify', () => {
  test('Given correct code and password When verifying Then returns userId and token', async () => {
    const result = await handleVerify({ identifier: 'user', idLast4: '1234', code: '123456', password: 'password123' });
    expect(typeof result.userId).toBe('string');
    expect(typeof result.token).toBe('string');
  });
});
