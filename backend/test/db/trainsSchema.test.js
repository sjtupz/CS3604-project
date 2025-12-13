const { initializeDatabase, get, close } = require('../../src/db/personal_database');

describe('DB-Schema-Trains', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await close();
  });

  test('存在 trains 表', async () => {
    const row = await get("SELECT name FROM sqlite_master WHERE type='table' AND name='trains'");
    expect(row && row.name).toBe('trains');
  });

  test('存在 stations 表', async () => {
    const row = await get("SELECT name FROM sqlite_master WHERE type='table' AND name='stations'");
    expect(row && row.name).toBe('stations');
  });
});
