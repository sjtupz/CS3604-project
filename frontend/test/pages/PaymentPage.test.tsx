import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock navigate
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...mod, useNavigate: () => navigateMock, MemoryRouter: mod.MemoryRouter };
});

// Mock API
vi.mock('../../src/api/orders', () => ({
  payOrder: vi.fn(async () => ({ code: 200 })),
  cancelOrder: vi.fn(async () => ({ code: 200 })),
  getOrderDetails: vi.fn(async () => ({ data: { passengerInfo: [], trainInfo: {} } })),
}));

import PaymentPage from '../../src/pages/PaymentPage';

describe('支付页面交互', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    try { sessionStorage.setItem('currentOrderId', 'order-uuid-123'); } catch {}
    try { sessionStorage.removeItem('currentOrderExpireAt'); } catch {}
  });

  test('Given 用户在支付页面 When 用户点击“取消订单”按钮 Then 系统弹出取消确认弹窗', async () => {
    render(
      <PaymentPage />
    );

    await userEvent.click(screen.getByRole('button', { name: '取消订单' }));
    const title = screen.getByText('交易提示');
    expect(title).toBeInTheDocument();
    expect(title).toHaveStyle('background-color: rgb(24, 144, 255)');
    expect(
      screen.getByText(
        '在一天内3次申请车票成功后取消订单（包含无座票时取消5次计为取消1次），当日将不能在12306继续购票。'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '确认' })).toBeInTheDocument();
  });

  test('Given 取消确认弹窗已弹出 When 用户点击“取消”按钮 Then 弹窗关闭并返回支付页面', async () => {
    render(<PaymentPage />);
    await userEvent.click(screen.getByRole('button', { name: '取消订单' }));
    const cancelBtn = screen.getByRole('button', { name: '取消' });
    await userEvent.click(cancelBtn);
    expect(screen.queryByText('交易提示')).not.toBeInTheDocument();
  });

  test('Given 取消确认弹窗已弹出 When 用户点击“确认”按钮 Then 系统将订单状态变更为“已取消”并跳转到车次列表页', async () => {
    const { cancelOrder } = await import('../../src/api/orders');
    render(<PaymentPage />);
    await userEvent.click(screen.getByRole('button', { name: '取消订单' }));
    await userEvent.click(screen.getByRole('button', { name: '确认' }));
    expect(cancelOrder).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/tickets');
  });

  test('Given 用户在支付页面 When 用户点击“网上支付”按钮 Then 订单状态变更为“已支付”并跳转到支付成功页', async () => {
    const { payOrder } = await import('../../src/api/orders');
    render(<PaymentPage />);
    await userEvent.click(screen.getByRole('button', { name: '网上支付' }));
    expect(payOrder).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/payment/success');
  });

  test('Given 用户离开支付页后返回 When 基于创建时间计算 Then 倒计时不会重置', async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2025-12-24T00:10:00.000Z'));

      const { getOrderDetails } = await import('../../src/api/orders');
      (getOrderDetails as any).mockResolvedValueOnce({
        data: {
          createdAt: '2025-12-24T00:00:00.000Z',
          passengerInfo: [],
          trainInfo: {}
        }
      });

      render(<PaymentPage />);
      await act(async () => {
        await Promise.resolve();
      });
      expect(screen.getByText('10分00秒')).toBeTruthy();

      vi.setSystemTime(new Date('2025-12-24T00:12:00.000Z'));
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText('8分00秒')).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });
});
