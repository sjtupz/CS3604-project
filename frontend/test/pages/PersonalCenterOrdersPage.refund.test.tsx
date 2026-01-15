import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PersonalCenterOrdersPage from '../../src/pages/PersonalCenterOrdersPage';
import * as ordersApi from '../../src/api/orders';
import { BrowserRouter } from 'react-router-dom';

// Mock API
vi.mock('../../src/api/orders');

describe('PersonalCenterOrdersPage - Refund Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('authToken', 'test-token');
  });

  test('Given 未出行订单列表 When 渲染 Then 显示退票按钮', async () => {
    // Mock orders
    (ordersApi.getOrders as any).mockResolvedValue({
        data: {
            items: [
                {
                    orderId: 'order-1',
                    status: '已支付',
                    trainNumber: 'G123',
                    // ... other fields
                }
            ],
            pagination: { total: 1 }
        }
    });

    render(
      <BrowserRouter>
        <PersonalCenterOrdersPage />
      </BrowserRouter>
    );

    // 骨架代码可能未实现退票按钮，预期失败
    await waitFor(() => {
        expect(screen.getByText('退票')).toBeInTheDocument();
    });
  });

  test('Given 用户点击退票 When 点击 Then 弹出确认弹窗', async () => {
    (ordersApi.getOrders as any).mockResolvedValue({
        data: {
            items: [{ orderId: 'order-1', status: '已支付' }],
            pagination: { total: 1 }
        }
    });

    // Mock getRefundPreview
    (ordersApi.getRefundPreview as any).mockResolvedValue({
        data: {
            orderId: 'order-1',
            originalPrice: 100,
            refundFee: 5,
            refundFeeRate: 5,
            refundAmount: 95
        }
    });

    render(
      <BrowserRouter>
        <PersonalCenterOrdersPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('退票'));
    
    fireEvent.click(screen.getByText('退票'));

    // 验证弹窗出现 (通过 data-testid 或 文本)
    await waitFor(() => {
        expect(screen.getByTestId('refund-confirm-modal')).toBeInTheDocument();
    });
  });

  test('Given 已退票订单 When 渲染 Then 显示灰色且无退票按钮', async () => {
    (ordersApi.getOrders as any).mockResolvedValue({
        data: {
            items: [{ orderId: 'order-2', status: '已退票', refundAmount: 95 }],
            pagination: { total: 1 }
        }
    });

    render(
      <BrowserRouter>
        <PersonalCenterOrdersPage />
      </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('已退票')).toBeInTheDocument();
    });

    // 验证无退票按钮
    expect(screen.queryByText('退票')).not.toBeInTheDocument();
    // 验证灰色样式 (可选，通过 class 验证)
  });
});
