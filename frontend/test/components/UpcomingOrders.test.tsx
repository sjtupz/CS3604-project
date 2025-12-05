import React from 'react';
import { render, screen } from '@testing-library/react';
import UpcomingOrders from '../../src/components/UpcomingOrders';
import '@testing-library/jest-dom';

test('sets default date range and formats dates', () => {
  const { container } = render(<UpcomingOrders orders={[]} />);
  
  const startInput = container.querySelector('#startDate') as HTMLInputElement;
  const endInput = container.querySelector('#endDate') as HTMLInputElement;

  expect(startInput.value).toBeTruthy();
  expect(endInput.value).toBeTruthy();
});

test('displays orders with hyphenated dates', () => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const dateStrSlash = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

  const mockOrders = [{
    orderId: '1',
    bookingDate: dateStrSlash, // Use slash format input to test replacement
    trainNumber: 'G123'
  }];

  render(<UpcomingOrders orders={mockOrders} />);
  
  // Should display with hyphens
  expect(screen.getByText(dateStr)).toBeInTheDocument();
});
