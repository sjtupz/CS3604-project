import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, vi } from 'vitest';
import OrderConfirmModal from '../../src/components/OrderConfirmModal';
import { getOrderDetails } from '../../src/api/orders';

vi.mock('../../src/api/orders', () => ({
  getOrderDetails: vi.fn().mockResolvedValue({
    data: {
      trainInfo: {
        date: '2025-12-24',
        trainNumber: 'G108',
        fromStation: '上海虹桥',
        toStation: '北京南',
        departureTime: '08:00',
        arrivalTime: '12:30',
        seatType: '二等座'
      },
      passengerInfo: [
        { name: '张三', idType: '身份证', idNumber: '110***********1234', ticketType: '成人票' }
      ],
      price: 100
    }
  }),
  confirmOrder: vi.fn(),
  cancelOrder: vi.fn()
}));

describe('OrderConfirmModal', () => {
  test('Given 勾选乘车人 When 弹出确认订单弹窗 Then 顶部显示“请核对以下信息”蓝色条', async () => {
    render(<OrderConfirmModal orderId="order-1" onClose={() => {}} onSuccess={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText('请核对以下信息')).toBeInTheDocument();
    });
  });

  test('Given 弹窗显示 When 查看订单区域 Then 表头含“序号/席别/票种/姓名/证件类型/证件号码”', async () => {
    render(<OrderConfirmModal orderId="order-1" onClose={() => {}} onSuccess={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText('序号')).toBeInTheDocument();
      expect(screen.getByText('席别')).toBeInTheDocument();
      expect(screen.getByText('票种')).toBeInTheDocument();
      expect(screen.getByText('姓名')).toBeInTheDocument();
      expect(screen.getByText('证件类型')).toBeInTheDocument();
      expect(screen.getByText('证件号码')).toBeInTheDocument();
    });
  });

  test('Given 弹窗显示 When 查看按钮区域 Then 包含“返回修改”和“确认”按钮', async () => {
    render(<OrderConfirmModal orderId="order-1" onClose={() => {}} onSuccess={() => {}} />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '返回修改' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '确认' })).toBeInTheDocument();
    });
  });

  test('Given 弹窗显示 When 查看余票信息 Then 显示“本次列车，二等座余票X张”', async () => {
    render(<OrderConfirmModal orderId="order-1" onClose={() => {}} onSuccess={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText(/本次列车，二等座余票/)).toBeInTheDocument();
    });
  });

  test('Given 订单trainInfo为JSON字符串 When 弹窗加载 Then 展示出发时间与到达时间', async () => {
    (getOrderDetails as any).mockResolvedValueOnce({
      data: {
        trainInfo: JSON.stringify({
          date: '2025-12-24',
          trainNumber: 'G108',
          fromStation: '上海虹桥',
          toStation: '北京南',
          departureTime: '08:00',
          arrivalTime: '12:30',
          seatType: '二等座'
        }),
        passengerInfo: JSON.stringify([
          { name: '张三', idType: '身份证', idNumber: '110***********1234', ticketType: '成人票' }
        ]),
        price: 100
      }
    });

    render(<OrderConfirmModal orderId="order-1" onClose={() => {}} onSuccess={() => {}} />);
    expect(await screen.findByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('12:30')).toBeInTheDocument();
  });
});
