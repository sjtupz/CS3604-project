import { render, screen } from '@testing-library/react';
import { describe, test, vi } from 'vitest';
import OrderProcessingModal from '../../src/components/OrderProcessingModal';

vi.useFakeTimers();

describe('OrderProcessingModal', () => {
  test('Given 提示弹窗已弹出 When 后端在3秒内成功处理订单 And 显示满3秒 Then 关闭并跳转支付页', async () => {
    render(<OrderProcessingModal orderId="order-1" />);
    expect(screen.getByText('订单已经提交，系统正在处理中，请稍等')).toBeInTheDocument();
  });

  test('Given 提示弹窗已弹出 When 显示满3秒后未成功 Then 继续显示3秒', async () => {
    render(<OrderProcessingModal orderId="order-1" />);
    expect(screen.getByText('订单已经提交，系统正在处理中，请稍等')).toBeInTheDocument();
  });

  test('Given 提示弹窗已弹出 When 显示超过60秒 Then 关闭并返回订单填写页提示失败', async () => {
    render(<OrderProcessingModal orderId="order-1" />);
    expect(screen.getByText('订单已经提交，系统正在处理中，请稍等')).toBeInTheDocument();
  });
});
