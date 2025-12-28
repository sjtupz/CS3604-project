import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock navigate
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...mod, useNavigate: () => navigateMock, MemoryRouter: mod.MemoryRouter };
});

// Mock API to provide passengers and seat prices
vi.mock('../../src/api/orders', () => ({
  payOrder: vi.fn(async () => ({ code: 200 })),
  cancelOrder: vi.fn(async () => ({ code: 200 })),
  getOrderDetails: vi.fn(async () => ({
    data: {
      passengerInfo: [
        { name: '张三', idType: '身份证', idNumber: '110101199001011234', ticketType: '成人票', seatType: '二等座' },
        { name: '李四', idType: '身份证', idNumber: '110101199202023333', ticketType: '成人票', seatType: '一等座' }
      ],
      trainInfo: {
        seats: [
          { type: '一等座', count: '10', price: 200 },
          { type: '二等座', count: '20', price: 100 }
        ]
      }
    }
  })),
}));

import PaymentPage from '../../src/pages/PaymentPage';
import { getOrderDetails } from '../../src/api/orders';

describe('支付页面价格展示', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    try { sessionStorage.setItem('currentOrderId', 'order-uuid-123'); } catch {}
  });

  test('Given 有两名乘客与座席价格 When 渲染支付页 Then 显示正确总价', async () => {
    render(<PaymentPage />);
    const total = await screen.findByText('总票价：300元');
    expect(total).toBeInTheDocument();
  });

  test('Given 订单trainInfo为JSON字符串 When 渲染支付页 Then 显示正确总价', async () => {
    (getOrderDetails as any).mockResolvedValueOnce({
      data: {
        passengerInfo: [
          { name: '张三', idType: '身份证', idNumber: '110101199001011234', ticketType: '成人票', seatType: '二等座' },
          { name: '李四', idType: '身份证', idNumber: '110101199202023333', ticketType: '成人票', seatType: '一等座' }
        ],
        trainInfo: JSON.stringify({
          seats: [
            { type: '一等座', count: '10', price: 200 },
            { type: '二等座', count: '20', price: 100 }
          ]
        })
      }
    });

    render(<PaymentPage />);
    const total = await screen.findByText('总票价：300元');
    expect(total).toBeInTheDocument();
  });
});
