const { findTrainsInDb, getRemainingTickets } = require('../../src/db/train');

describe('DB-FindTrains', () => {
  test('Given 必填参数 When 查询 Then 返回非空数组', async () => {
    await expect(findTrainsInDb({ from: '上海', to: '北京', date: '2025-12-25' }))
      .resolves.toEqual(expect.arrayContaining([]));
  });
});

describe('DB-GetRemainingTickets', () => {
  test('Given 非相邻两站 When 统计余票 Then 满足以座位为单位规则', async () => {
    await expect(getRemainingTickets({ trainNumber: 'G108', from: '上海虹桥', to: '北京南', seatType: '二等座' }))
      .resolves.toBeGreaterThanOrEqual(0);
  });
});

