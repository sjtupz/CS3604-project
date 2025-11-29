const { createLoginCodeRecord } = require('../../src/db/createLoginCodeRecord');

describe('DB: CreateLoginCodeRecord', () => {
  test('Given phone and code When creating record Then record is stored', async () => {
    const result = await createLoginCodeRecord({ phone: '13800138000', identifier: 'user', code: '123456' });
    expect(result).toBeTruthy();
  });
});
