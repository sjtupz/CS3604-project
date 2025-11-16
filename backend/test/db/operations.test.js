const { findAllStations, findTrains } = require('../../src/db/operations');
const { setupTestDB, teardownTestDB } = require('../test-db');

describe('Database Operations', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  test('Given the database contains station data, When findAllStations is called, Then it should return a list of all stations', async () => {
    const stations = await findAllStations();
    expect(stations).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: '北京南', pinyin: 'beijingnan' }),
    ]));
  });

  test('Given valid search criteria, When findTrains is called, Then it should return a list of matching trains', async () => {
    const trains = await findTrains('北京南', '上海虹桥', '2025-11-17', true);
    expect(trains).toEqual(expect.arrayContaining([
      expect.objectContaining({
        trainNumber: 'G1',
        fromStation: '北京南',
        toStation: '上海虹桥',
        date: '2025-11-17',
        isHighSpeed: 1,
      }),
    ]));
  });
});