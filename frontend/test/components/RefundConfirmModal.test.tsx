import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { RefundConfirmModal } from '../../src/components/RefundConfirmModal';
import * as ordersApi from '../../src/api/orders';
import { BrowserRouter } from 'react-router-dom';

// Mock API
vi.mock('../../src/api/orders');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('RefundConfirmModal', () => {
  const mockOnClose = vi.fn();
  const orderId = 'order-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Given 弹窗打开 When 加载时 Then 调用预览接口并展示费用', async () => {
    (ordersApi.getRefundPreview as any).mockResolvedValue({
        data: {
            orderId,
            originalPrice: 100,
            refundFee: 5,
            refundFeeRate: 5,
            refundAmount: 95
        }
    });

    render(
      <BrowserRouter>
        <RefundConfirmModal orderId={orderId} onClose={mockOnClose} />
      </BrowserRouter>
    );

    // 验证调用了预览接口
    expect(ordersApi.getRefundPreview).toHaveBeenCalledWith(orderId);

    // 验证展示了加载后的数据
    await waitFor(() => {
        // "共计退款：" now has normal font weight, and amount is in separate span with orange-text-large
        expect(screen.getByText(/共计退款：/)).toBeInTheDocument();
        
        // Updated text structure - amount is in separate element with class orange-text
        expect(screen.getByText('5.0元')).toBeInTheDocument();
        expect(screen.getByText('100.0元')).toBeInTheDocument();
        
        // Since there are two '95.0元' (total refund and应退票款), we can check for getAll or specific context if needed.
        const amounts95 = screen.getAllByText('95.0元');
        expect(amounts95.length).toBeGreaterThanOrEqual(2);
    });
  });

  test('Given 用户点击确定 When 接口成功 Then 调用退票接口并跳转', async () => {
    (ordersApi.getRefundPreview as any).mockResolvedValue({ 
        data: {
            orderId,
            originalPrice: 100,
            refundFee: 5,
            refundFeeRate: 5,
            refundAmount: 95
        } 
    });
    (ordersApi.refundOrder as any).mockResolvedValue({ code: 200 });

    render(
      <BrowserRouter>
        <RefundConfirmModal orderId={orderId} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('确定'));

    const confirmBtn = screen.getByText('确定');
    fireEvent.click(confirmBtn);

    // 验证调用了退票接口
    expect(ordersApi.refundOrder).toHaveBeenCalledWith(orderId);
  });
});
