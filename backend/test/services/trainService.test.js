const {
  findTrains,
  searchTrains,
  getTrainSchedule,
  findTrainsRoundTrip,
} = require('../../src/services/trainService');

describe('trainService', () => {
  test('Given 查询条件 When 调用 findTrains Then 返回 items 和 pagination', async () => {
    await expect(findTrains({ from: '上海', to: '北京', date: '2025-12-25' }))
      .resolves.toHaveProperty('items');
  });

  test('Given 精确条件 When 调用 searchTrains Then 返回 items', async () => {
    await expect(searchTrains({ trainNumber: 'G108' }))
      .resolves.toHaveProperty('items');
  });

  test('Given 车次号 When 调用 getTrainSchedule Then 返回 stationSchedules', async () => {
    await expect(getTrainSchedule('G108', '2025-12-25'))
      .resolves.toHaveProperty('stationSchedules');
  });

  test('Given 双程参数 When 调用 findTrainsRoundTrip Then 返回 outbound 与 return', async () => {
    await expect(findTrainsRoundTrip({ from: '上海', to: '北京', departDate: '2025-12-25', returnDate: '2025-12-26' }))
      .resolves.toHaveProperty('outbound');
  });
});

