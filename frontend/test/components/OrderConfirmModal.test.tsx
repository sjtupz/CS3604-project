import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import OrderConfirmModal from '../../src/components/OrderConfirmModal';
import React from 'react';

// Mock API
vi.mock('../../src/api/orders', () => ({
  getOrderDetails: vi.fn(() => Promise.resolve({
    data: {
      orderId: 'order-123',
      price: 100,
      trainInfo: {
        date: '2025-12-24',
        trainNumber: 'T109',
        fromStation: '北京',
        toStation: '上海',
        departureTime: '20:03',
        arrivalTime: '11:02',
        seatType: '二等座'
      },
      passengerInfo: [
        { name: '张三', idType: '中国居民身份证', idNumber: '110101199001011234', ticketType: '成人票' }
      ]
    }
  })),
  confirmOrder: vi.fn(),
  cancelOrder: vi.fn()
}));

describe('OrderConfirmModal', () => {
  test('Given 确认订单页面 When 弹窗加载 Then 显示订单倒计时', async () => {
    render(<OrderConfirmModal orderId="order-123" onClose={() => {}} onSuccess={() => {}} />);
    expect(await screen.findByText(/支付剩余时间/)).toBeDefined();
  });

  test('Given 确认订单页面 When 弹窗加载 Then 显示订单信息区域标题', async () => {
    render(<OrderConfirmModal orderId="order-123" onClose={() => {}} onSuccess={() => {}} />);
    expect(await screen.findByText('订单信息')).toBeDefined();
  });

  test('Given 按钮区域 When 渲染 Then 包含“取消订单”和“网上支付”按钮', async () => {
    render(<OrderConfirmModal orderId="order-123" onClose={() => {}} onSuccess={() => {}} />);
    expect(await screen.findByText('取消订单')).toBeDefined();
    expect(screen.getByText('网上支付')).toBeDefined();
  });
});
