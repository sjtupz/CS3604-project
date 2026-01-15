const request = require('supertest');
const app = require('../../src/app'); // 假设这是 Express app 入口
const { generateToken: createToken } = require('../../src/utils/auth'); // 假设有工具生成测试token

// Mock service
jest.mock('../../src/services/refundService', () => ({
    getRefundPreview: jest.fn(),
    processRefund: jest.fn()
}));

const refundService = require('../../src/services/refundService');

describe('Order Refund Routes', () => {
    const token = createToken({ id: 'user-123' });
    const orderId = 'order-abc';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/orders/:orderId/refund-preview', () => {
        test('Given 有效请求 When 获取预览 Then 返回 200 和数据', async () => {
            refundService.getRefundPreview.mockResolvedValue({
                orderId,
                originalPrice: 100,
                refundFee: 5,
                refundAmount: 95
            });

            const res = await request(app)
                .get(`/api/orders/${orderId}/refund-preview`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.code).toBe(200);
            expect(res.body.data.refundAmount).toBe(95);
        });

        test('Given 服务抛错 When 获取预览 Then 返回对应错误码', async () => {
            const error = new Error('不支持退票');
            error.code = 40006;
            refundService.getRefundPreview.mockRejectedValue(error);

            const res = await request(app)
                .get(`/api/orders/${orderId}/refund-preview`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(400); // 40006 -> 400
            expect(res.body.code).toBe(40006);
        });
    });

    describe('POST /api/orders/:orderId/refund', () => {
        test('Given 有效请求 When 提交退票 Then 返回 200 和成功信息', async () => {
            refundService.processRefund.mockResolvedValue({
                orderId,
                refundAmount: 95
            });

            const res = await request(app)
                .post(`/api/orders/${orderId}/refund`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.refundAmount).toBe(95);
        });
    });
});
