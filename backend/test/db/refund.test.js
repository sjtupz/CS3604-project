const { calculateRefundFee } = require('../../src/db/refund');

describe('DB-CalculateRefundFee', () => {
    // 假设票价 100元
    const ticketPrice = 100;
    const departureTime = '2025-01-10T10:00:00';

    test('Given 退票时间在发车前8天以上 When 计算退票费 Then 手续费为0，应退全款', () => {
        const refundTime = '2025-01-01T10:00:00'; // 9天前
        const result = calculateRefundFee(ticketPrice, departureTime, refundTime);
        expect(result).toEqual({
            fee: 0,
            feeRate: 0,
            refundAmount: 100
        });
    });

    test('Given 退票时间在发车前48小时以上不足8天 When 计算退票费 Then 按5%计费', () => {
        const refundTime = '2025-01-07T10:00:00'; // 3天前
        const result = calculateRefundFee(ticketPrice, departureTime, refundTime);
        expect(result.feeRate).toBe(5);
        expect(result.fee).toBe(5);
        expect(result.refundAmount).toBe(95);
    });

    test('Given 退票时间在发车前24小时以上不足48小时 When 计算退票费 Then 按10%计费', () => {
        const refundTime = '2025-01-09T09:00:00'; // 25小时前
        const result = calculateRefundFee(ticketPrice, departureTime, refundTime);
        expect(result.feeRate).toBe(10);
        expect(result.fee).toBe(10);
        expect(result.refundAmount).toBe(90);
    });

    test('Given 退票时间不足24小时 When 计算退票费 Then 按20%计费', () => {
        const refundTime = '2025-01-10T09:00:00'; // 1小时前
        const result = calculateRefundFee(ticketPrice, departureTime, refundTime);
        expect(result.feeRate).toBe(20);
        expect(result.fee).toBe(20);
        expect(result.refundAmount).toBe(80);
    });

    test('Given 手续费尾数处理 When 计算结果有小数 Then 按0.5元单位处理', () => {
        // 票价 43元，20% -> 8.6元 -> 9.0元 (8.6 > 8.5+0.1, 进位?)
        // 规则：尾数 < 2.5角舍去；2.5角（含）以上且小于7.5角计为5角；7.5角（含）以上进为1元
        // 8.6元: 尾数0.6元 = 6角。 2.5 <= 6 < 7.5 -> 计为5角 -> 8.5元
        
        const price = 43;
        const result = calculateRefundFee(price, departureTime, '2025-01-10T09:00:00'); // 20%
        expect(result.fee).toBe(8.5); 
    });

    test('Given 最低手续费规则 When 计算手续费不足2元 Then 按2元计收', () => {
        const price = 5;
        const result = calculateRefundFee(price, departureTime, '2025-01-09T09:00:00'); // 10% -> 0.5元
        expect(result.fee).toBe(2);
        expect(result.refundAmount).toBe(3);
    });
});
