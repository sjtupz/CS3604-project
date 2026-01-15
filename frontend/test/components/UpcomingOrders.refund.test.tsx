import React from 'react';
import { render, screen } from '@testing-library/react';
import UpcomingOrders from '../../src/components/UpcomingOrders';
import '@testing-library/jest-dom';

describe('UpcomingOrders Refund Display', () => {
  const getRelativeDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  test('displays refunded orders in gray and hides refund button', () => {
    // Use a date within default range (-30 to +90)
    // Let's use tomorrow
    const futureDate = getRelativeDate(1);
    
    const refundedOrder = {
      orderId: 'refunded-1',
      status: '已退票',
      trainNumber: 'G999',
      bookingDate: futureDate, 
      travelDate: futureDate,
      passengerName: 'Test Passenger',
      price: 100
    };

    render(<UpcomingOrders orders={[refundedOrder]} />);

    // Check status text
    const statusElement = screen.getByText('已退票');
    expect(statusElement).toBeInTheDocument();
    
    // Check color (gray)
    expect(statusElement).toHaveStyle({ color: '#999' });

    // Check refund button is NOT present
    const refundButton = screen.queryByText('退票');
    expect(refundButton).not.toBeInTheDocument();
  });

  test('displays paid orders in black and shows refund button', () => {
    // Use a date within default range
    const futureDate = getRelativeDate(2);

    const paidOrder = {
      orderId: 'paid-1',
      status: '已支付',
      trainNumber: 'G888',
      bookingDate: futureDate,
      travelDate: futureDate,
      passengerName: 'Test Passenger',
      price: 100
    };

    render(<UpcomingOrders orders={[paidOrder]} />);

    // Check status text
    const statusElement = screen.getByText('已支付');
    expect(statusElement).toBeInTheDocument();
    
    // Check color (default/black)
    expect(statusElement).toHaveStyle({ color: '#333' });

    // Check refund button IS present
    const refundButton = screen.getByText('退票');
    expect(refundButton).toBeInTheDocument();
  });

  test('shows future orders by default (date filter check)', () => {
    // Use a date within +90 days but far enough
    const futureDate = getRelativeDate(60);

    const futureOrder = {
      orderId: 'future-1',
      status: '已支付',
      trainNumber: 'G777',
      bookingDate: futureDate,
      travelDate: futureDate,
      passengerName: 'Future Passenger'
    };

    render(<UpcomingOrders orders={[futureOrder]} />);

    expect(screen.getByText(/G777/)).toBeInTheDocument();
  });
});
