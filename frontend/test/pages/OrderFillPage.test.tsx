import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import OrderFillPage from '../../src/pages/OrderFillPage';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mock API
vi.mock('../../src/api/passengers', () => ({
  getPassengers: vi.fn(() => Promise.resolve([
    { passengerId: '1', name: '张三', idType: '中国居民身份证', idNumber: '110101199001011234' }
  ]))
}));

vi.mock('../../src/api/orders', () => ({
  createOrder: vi.fn(),
  getOrderDetails: vi.fn(),
  confirmOrder: vi.fn(),
  cancelOrder: vi.fn()
}));

describe('OrderFillPage', () => {
  test('Given 系统跳转到订单填写页 When 购票界面已经正确加载 Then 整体页面布局包含上中下三部分', () => {
    render(
      <MemoryRouter>
        <OrderFillPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('banner')).toBeDefined(); // 顶部导航
    expect(screen.getByTestId('quick-access')).toBeDefined(); // 快捷入口
    expect(screen.getByTestId('booking-area')).toBeDefined(); // 购票页面
  });

  test('Given 购票界面已经正确加载 When 用户点击乘车人复选框 Then 车票信息表格中动态添加该乘车人信息', async () => {
    render(
      <MemoryRouter>
        <OrderFillPage />
      </MemoryRouter>
    );
    
    // 等待乘车人加载
    const checkbox = await screen.findByLabelText('张三');
    fireEvent.click(checkbox);
    
    // 检查表格中是否出现了张三
    const tableCells = screen.getAllByRole('cell');
    expect(tableCells.some(cell => cell.textContent === '张三')).toBe(true);
  });

  test('Given 勾选了乘车人 When 用户点击提交订单 Then 弹出确认订单模态框', async () => {
    const { createOrder, getOrderDetails } = await import('../../src/api/orders');
    vi.mocked(createOrder).mockResolvedValueOnce({ data: { orderId: 'test-order-123' } });
    vi.mocked(getOrderDetails).mockResolvedValueOnce({ 
      data: { 
        orderId: 'test-order-123',
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
    });
    
    render(
      <MemoryRouter>
        <OrderFillPage />
      </MemoryRouter>
    );
    
    const checkbox = await screen.findByLabelText('张三');
    fireEvent.click(checkbox);
    
    const submitBtn = screen.getByText('提交订单');
    fireEvent.click(submitBtn);
    
    // 检查是否调用了 API
    expect(createOrder).toHaveBeenCalled();
    
    // 检查模态框内容
    expect(await screen.findByText(/席位已锁定/)).toBeDefined();
    expect(screen.getByText('网上支付')).toBeDefined();
  });
});
