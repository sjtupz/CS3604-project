import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import TrainInfoBox from '../../src/components/TrainInfoBox';
import React from 'react';

describe('TrainInfoBox', () => {
  const mockTrain = {
    trainNumber: 'G108',
    date: '2025-12-24',
    fromStation: '北京南',
    toStation: '上海虹桥',
    departureTime: '08:00',
    arrivalTime: '13:18',
    seats: [
      { type: '二等座', count: 100, price: 553 },
      { type: '一等座', count: 20, price: 933 }
    ]
  };

  test('Given 列车信息窗口初始化 When 购票界面已经正确加载 Then 显示车次详细信息', () => {
    render(<TrainInfoBox train={mockTrain} />);
    expect(screen.getByText(/G108/)).toBeDefined();
    expect(screen.getByText(/北京南/)).toBeDefined();
    expect(screen.getByText(/上海虹桥/)).toBeDefined();
  });

  test('Given 列车信息窗口初始化 When 购票界面已经正确加载 Then 换行显示席位数量与价格', () => {
    render(<TrainInfoBox train={mockTrain} />);
    expect(screen.getByText(/二等座/)).toBeDefined();
    expect(screen.getByText(/553/)).toBeDefined();
  });
});
