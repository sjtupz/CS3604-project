import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PersonalCenterLayout from '../../src/components/PersonalCenterLayout';
import '@testing-library/jest-dom';
import * as passengerApi from '../../src/api/passengers';
import * as userApi from '../../src/api/personal_user'; // PassengerList also calls getUserInfo
import { vi } from 'vitest';

// Mock API modules
vi.mock('../../src/api/passengers');
vi.mock('../../src/api/personal_user');

describe('PersonalCenterLayout Passenger Integration', () => {
  test('Clicking Add button switches to PassengerForm', async () => {
    // Mock API responses
    (passengerApi.getPassengers as any).mockResolvedValue([]);
    (userApi.getUserInfo as any).mockResolvedValue({}); // Mock user info for PassengerList
    
    render(<PersonalCenterLayout activeSection="乘车人" />);

    // 1. Verify List is shown initially
    // "Add" button should be visible
    const addBtn = await screen.findByText('+ 添加');
    expect(addBtn).toBeInTheDocument();

    // 2. Click Add -> Switch to Form
    fireEvent.click(addBtn);

    // Verify Form is shown
    // PassengerForm renders <h2>添加乘车人</h2> when adding
    const formTitle = await screen.findByText('添加乘车人');
    expect(formTitle).toBeInTheDocument();
    
    // Verify List (Add button) is GONE
    expect(screen.queryByText('+ 添加')).not.toBeInTheDocument();
    
    // 3. Click Cancel -> Switch back to List
    const cancelBtn = screen.getByText('取消');
    fireEvent.click(cancelBtn);
    
    // Verify List is back
    expect(await screen.findByText('+ 添加')).toBeInTheDocument();
  });
});

describe('PersonalCenterLayout 未完成订单展示', () => {
  test('Given 新订单包含trainInfo When 查看未完成订单 Then 展示站点名与出发时间', async () => {
    render(
      <PersonalCenterLayout
        activeSection="火车票订单"
        orders={[
          {
            id: 'order-1',
            status: '待支付',
            trainNumber: 'G108',
            trainInfo: {
              date: '2025-12-07',
              fromStation: '上海南',
              toStation: '北京南',
              departureTime: '08:37'
            },
            passengerInfo: [{ name: '张三', idType: '身份证' }],
            price: 500,
          } as any,
        ]}
      />
    );

    expect(await screen.findByText('车次信息')).toBeInTheDocument();
    expect(screen.getByText('上海南 → 北京南 G108')).toBeInTheDocument();
    expect(screen.getByText(/2025-12-07\s+08:37\s+开/)).toBeInTheDocument();
  });

  test('Given 订单trainInfo为snake_case When 查看未完成订单 Then 展示出发时间', async () => {
    render(
      <PersonalCenterLayout
        activeSection="火车票订单"
        orders={[
          {
            id: 'order-1',
            status: '待支付',
            trainNumber: 'G108',
            trainInfo: {
              date: '2025-12-07',
              fromStation: '上海南',
              toStation: '北京南',
              start_time: '08:37'
            },
            passengerInfo: [{ name: '张三', idType: '身份证' }],
            price: 500,
          } as any,
        ]}
      />
    );

    expect(await screen.findByText('车次信息')).toBeInTheDocument();
    expect(screen.getByText(/2025-12-07\s+08:37\s+开/)).toBeInTheDocument();
  });

  test('Given 订单trainInfo为JSON字符串 When 查看未完成订单 Then 展示出发时间', async () => {
    render(
      <PersonalCenterLayout
        activeSection="火车票订单"
        orders={[
          {
            id: 'order-1',
            status: '待支付',
            trainNumber: 'G108',
            trainInfo: JSON.stringify({
              date: '2025-12-07',
              fromStation: '上海南',
              toStation: '北京南',
              start_time: '08:37'
            }),
            passengerInfo: JSON.stringify([{ name: '张三', idType: '身份证' }]),
            price: 500,
          } as any,
        ]}
      />
    );

    expect(await screen.findByText('车次信息')).toBeInTheDocument();
    expect(screen.getByText(/2025-12-07\s+08:37\s+开/)).toBeInTheDocument();
  });
});
