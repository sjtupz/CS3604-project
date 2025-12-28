const { updateSeatStatusOnReservation } = require('../../src/db/updateSeatStatusOnReservation');

describe('DB-UpdateSeatStatusOnReservation', () => {
  test('Given 预订成功 When 更新座位状态 Then 所有相关站段状态更新为已被预订', async () => {
    const payload = {
      trainNumber: 'G108',
      coachNo: '02',
      seatNo: '02A',
      segmentIds: ['S1-S2', 'S2-S3', 'S3-S4'],
    };
    const result = await updateSeatStatusOnReservation(payload);
    expect(result).toEqual({ updated: true, affectedSegments: payload.segmentIds.length });
  });
});
