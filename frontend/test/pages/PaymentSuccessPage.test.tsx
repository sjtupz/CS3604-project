import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentSuccessPage from '../../src/pages/PaymentSuccessPage';
import { getOrderDetails } from '../../src/api/orders';

vi.mock('../../src/api/orders', () => ({
  getOrderDetails: vi.fn(async () => ({
    data: {
      orderNo: 'EX123456789',
      passengerInfo: [
        { name: '张三', idType: '身份证', idNumber: '110101199001011234', ticketType: '成人票', seatType: '二等座', price: 500 },
      ],
      trainInfo: {
        date: '2025-12-07',
        fromStation: '上海南',
        toStation: '北京南',
        departureTime: '08:37',
      }
    }
  }))
}));

describe('支付成功页', () => {
  beforeEach(() => {
    try { sessionStorage.setItem('currentOrderId', 'order-uuid-123'); } catch {}
  });

  test('Given 用户在支付成功页 When 页面加载 Then 显示成功提示与实际订单号', async () => {
    render(<PaymentSuccessPage />);
    const el = await screen.findByText('交易已成功！感谢您选择铁路出行！您的订单号:EX123456789');
    expect(el).toBeInTheDocument();
  });

  test('Given 用户在支付成功页 When 查看订单信息 Then 使用支付页样式与真实乘车人信息', async () => {
    render(<PaymentSuccessPage />);

    const header = await screen.findByText('订单信息');
    expect(header).toHaveStyle('background-color: rgb(40, 139, 204)');
    expect(header).toHaveStyle('color: rgb(255, 255, 255)');

    expect(screen.getByText('序号')).toBeInTheDocument();
    expect(screen.getByText('姓名')).toBeInTheDocument();
    expect(screen.getByText('证件类型')).toBeInTheDocument();
    expect(screen.getByText('证件号码')).toBeInTheDocument();
    expect(screen.getByText('票种')).toBeInTheDocument();
    expect(screen.getByText('席别')).toBeInTheDocument();
    expect(screen.getByText('车厢')).toBeInTheDocument();
    expect(screen.getByText('席位号')).toBeInTheDocument();
    expect(screen.getByText('票价（元）')).toBeInTheDocument();

    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('08:37')).toBeInTheDocument();
    expect(screen.getByText('总票价：500元')).toBeInTheDocument();
  });

  test('Given 订单trainInfo为JSON字符串 When 查看订单信息 Then 展示出发时间', async () => {
    (getOrderDetails as any).mockResolvedValueOnce({
      data: {
        orderNo: 'EX123456789',
        passengerInfo: [
          { name: '张三', idType: '身份证', idNumber: '110101199001011234', ticketType: '成人票', seatType: '二等座', price: 500 },
        ],
        trainInfo: JSON.stringify({
          date: '2025-12-07',
          fromStation: '上海南',
          toStation: '北京南',
          start_time: '08:37'
        })
      }
    });

    render(<PaymentSuccessPage />);
    expect(await screen.findByText('08:37')).toBeInTheDocument();
  });
});
