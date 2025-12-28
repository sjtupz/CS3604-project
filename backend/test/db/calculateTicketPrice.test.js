const { calculateTicketPrice } = require('../../src/db/calculateTicketPrice');

describe('DB-CalculateTicketPrice', () => {
  test('Given 非相邻多段区间 When 计算票价 Then 返回所有相邻段之和', async () => {
    const params = {
      trainNumber: 'G108',
      from: '上海虹桥',
      to: '北京南',
      seatType: '二等座',
      segmentFare: {
        'S1-S2': 80,
        'S2-S3': 100,
        'S3-S4': 120,
        'S4-S5': 150,
      },
    };
    const result = await calculateTicketPrice(params);
    expect(result).toBe(450);
  });
});
