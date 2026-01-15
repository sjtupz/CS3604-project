const refundService = require('../../src/services/refundService');
const refundDb = require('../../src/db/refund');
const orderDb = require('../../src/db/orders');

// Mock dependencies
jest.mock('../../src/db/refund');
jest.mock('../../src/db/orders');

describe('Refund Service', () => {
    const userId = 'user-123';
    const orderId = 'order-abc';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getRefundPreview', () => {
        test('Given 订单已支付且未发车 When 获取预览 Then 返回预估费用', async () => {
            // Mock DB returns
            refundDb.calculateRefundFee.mockReturnValue({ fee: 5, feeRate: 5, refundAmount: 95 });
            
            orderDb.dbGetOrderDetails.mockResolvedValue({
                id: orderId,
                userId: userId,
                status: '已支付',
                price: 100,
                orderNumber: 'ORD-123',
                departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
            });
            
            const result = await refundService.getRefundPreview(orderId, userId);
            
            expect(result).toBeDefined();
            expect(result.refundFee).toBe(5);
            expect(result.refundAmount).toBe(95);
        });

        test('Given 订单不可退票(已发车) When 获取预览 Then 抛出错误', async () => {
            orderDb.dbGetOrderDetails.mockResolvedValue({
                id: orderId,
                userId: userId,
                status: '已支付',
                price: 100,
                departureTime: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
            });
            
            await expect(refundService.getRefundPreview(orderId, userId))
                .rejects.toThrow('当前订单不支持退票');
        });
    });

    describe('processRefund', () => {
        test('Given 合法退票请求 When 执行退票 Then 更新状态并释放席位', async () => {
            // Mock
            refundDb.calculateRefundFee.mockReturnValue({ fee: 5, feeRate: 5, refundAmount: 95 });

            orderDb.dbGetOrderDetails.mockResolvedValue({
                id: orderId,
                userId: userId,
                status: '已支付',
                price: 100,
                orderNumber: 'ORD-123',
                trainNumber: 'G123',
                departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                trainInfo: {
                    travelDate: '2025-12-26',
                    fromStationId: 'SH',
                    toStationId: 'BJ'
                },
                passengerInfo: [{ seatType: '二等座', seatNo: '1A' }]
            });
            orderDb.dbUpdateOrderStatus.mockResolvedValue(true);
            orderDb.dbReleaseSeats.mockResolvedValue(true);

            const result = await refundService.processRefund(orderId, userId);
            
            expect(result).toBeDefined();
            expect(result.refundAmount).toBe(95);
            expect(orderDb.dbUpdateOrderStatus).toHaveBeenCalledWith(
                orderId, 
                '已退票', 
                expect.objectContaining({ refundFee: 5, refundAmount: 95 })
            );
            expect(orderDb.dbReleaseSeats).toHaveBeenCalled();
        });
    });
});
