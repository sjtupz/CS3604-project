import React from 'react';
import { render, screen } from '@testing-library/react';
import HistoryOrders from '../../src/components/HistoryOrders';
import '@testing-library/jest-dom';

test('sets default date range', () => {
  const { container } = render(<HistoryOrders orders={[]} />);
  
  const startInput = container.querySelector('#startDate') as HTMLInputElement;
  const endInput = container.querySelector('#endDate') as HTMLInputElement;

  expect(startInput.value).toBeTruthy();
  expect(endInput.value).toBeTruthy();
});

test('displays orders with hyphenated dates', () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - 2); // Within the range (today-16 to today-1)
  
  const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
  const dateStrSlash = `${targetDate.getFullYear()}/${String(targetDate.getMonth() + 1).padStart(2, '0')}/${String(targetDate.getDate()).padStart(2, '0')}`;

  const mockOrders = [{
    orderId: '1',
    bookingDate: dateStrSlash,
    travelDate: dateStr, // travelDate used for filtering
    trainNumber: 'G123'
  }];

  render(<HistoryOrders orders={mockOrders} />);
  
  expect(screen.getByText(dateStr)).toBeInTheDocument();
});
