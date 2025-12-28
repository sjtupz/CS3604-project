import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import OrderFillPage from '../../src/pages/OrderFillPage';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mock API
vi.mock('../../src/api/passengers', () => ({
  getPassengers: vi.fn(() => Promise.resolve([
    { passengerId: '1', name: '张三', idType: '中国居民身份证', idNumber: '110101199001011234' },
    { passengerId: '2', name: '李四', idType: '中国居民身份证', idNumber: '110101199001015678' }
  ]))
}));

vi.mock('../../src/api/orders', () => ({
  createOrder: vi.fn(),
  getOrderDetails: vi.fn(),
  confirmOrder: vi.fn(),
  cancelOrder: vi.fn()
}));

// Mock train data via location state
const mockLocationState = {
  train: {
    trainNumber: 'T109',
    date: '2025-12-24',
    fromStation: '北京',
    toStation: '上海',
    departureTime: '20:03',
    arrivalTime: '11:02',
    seats: [
      { type: '一等座', count: '10', price: 200 },
      { type: '二等座', count: '20', price: 100 },
      { type: '软卧', count: '5', price: 120 },
      { type: '硬卧', count: '15', price: 74.5 }
    ]
  }
};

describe('OrderFillPage Seat Selection', () => {
  test('Given 多个乘车人 When 分别选择不同席别 Then 席别状态互不影响', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/order', state: mockLocationState }]}>
        <OrderFillPage />
      </MemoryRouter>
    );

    // Wait for passengers to load
    const checkboxA = await screen.findByLabelText('张三');
    const checkboxB = await screen.findByLabelText('李四');

    // Select both passengers
    fireEvent.click(checkboxA);
    fireEvent.click(checkboxB);

    // Find all seat type selects
    // The table has multiple selects. 
    // First col is ticket type (disabled), second col is seat type.
    // We can find them by the values or structure.
    // Let's use `getAllByRole('combobox')` but filtered.
    // Since ticket type select is disabled, `getByRole` might still find it.
    // Let's inspect the rows.
    
    // We can find the row for Zhang San and Li Si
    // "张三" appears in the checkbox label and in the table. We want the one in the table.
    const rowA = screen.getAllByText('张三').find(el => el.closest('tr') && el.closest('tbody'))?.closest('tr');
    const rowB = screen.getAllByText('李四').find(el => el.closest('tr') && el.closest('tbody'))?.closest('tr');

    expect(rowA).toBeDefined();
    expect(rowB).toBeDefined();

    // Within row A, find the seat select.
    // It's the second select in the row? Or we can look for the one with options "一等座", "二等座"...
    // Since we know the default is '一等座' (first in seats list) or '二等座' (default logic).
    // In code: `trainData.seats?.[0]?.type || '二等座'`.
    // Mock data has '一等座' as first.
    
    const selectsA = rowA!.querySelectorAll('select');
    const seatSelectA = selectsA[1]; // 0 is ticket type, 1 is seat type
    
    const selectsB = rowB!.querySelectorAll('select');
    const seatSelectB = selectsB[1];

    // Initial check: both should be '一等座' (based on mock data first item)
    expect(seatSelectA.value).toBe('一等座');
    expect(seatSelectB.value).toBe('一等座');

    // Change A to '二等座'
    fireEvent.change(seatSelectA, { target: { value: '二等座' } });

    // Verify A changed, B remained
    expect(seatSelectA.value).toBe('二等座');
    expect(seatSelectB.value).toBe('一等座');

    // Change B to '硬卧'
    fireEvent.change(seatSelectB, { target: { value: '硬卧' } });

    // Verify final state
    expect(seatSelectA.value).toBe('二等座');
    expect(seatSelectB.value).toBe('硬卧');
  });
});
