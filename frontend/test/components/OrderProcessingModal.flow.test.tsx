import { render } from '@testing-library/react';
import { describe, test, vi } from 'vitest';
import React from 'react';
import OrderProcessingModal from '../../src/components/OrderProcessingModal';

vi.useFakeTimers();

describe('OrderProcessingModal flow', () => {
  test('Given 提示弹窗已弹出 When 显示满3秒 Then 触发回调以便跳转支付页', () => {
    const onTimeout = vi.fn();
    render(<OrderProcessingModal orderId="order-1" onTimeout={onTimeout} />);
    vi.advanceTimersByTime(3000);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });
});

