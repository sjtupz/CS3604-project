
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TicketSearch from '../TicketSearch';
import { describe, it, expect, vi } from 'vitest';
import { fetchTickets } from '../../../services/ticketService';

// Mock API Response
const mockTickets = [
  {
    trainId: 1,
    trainNumber: 'G101',
    type: 'G',
    fromStation: '上海虹桥',
    toStation: '北京南',
    departureTime: '08:00',
    arrivalTime: '12:30',
    duration: '04:30',
    tickets: [
      { seatType: '商务座', price: 1800, count: 5 },
      { seatType: '二等座', price: 550, count: 100 }
    ]
  }
];

vi.mock('../../../services/ticketService', () => ({
  fetchTickets: vi.fn(async () => mockTickets)
}))

describe('TicketSearch Integration Test', () => {
  it('renders search form', () => {
    render(<TicketSearch />);
    expect(screen.getByText('车票查询')).toBeInTheDocument();
    expect(screen.getByLabelText('出发地')).toBeInTheDocument();
    expect(screen.getByLabelText('目的地')).toBeInTheDocument();
  });

  it('searches and displays tickets', async () => {
    render(<TicketSearch />);
    
    // Simulate user input
    // Note: React DatePicker might need specific handling, simplified here
    
    const searchBtn = screen.getByText('查询');
    fireEvent.click(searchBtn);

    // Wait for loading
    expect(screen.getByText('加载中...')).toBeInTheDocument();

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('G101')).toBeInTheDocument();
      expect(screen.getByText('08:00')).toBeInTheDocument();
      expect(screen.getByText('¥550')).toBeInTheDocument();
    });
  });

  it('handles empty results', async () => {
    vi.mocked(fetchTickets).mockResolvedValueOnce([])

    render(<TicketSearch />);
    fireEvent.click(screen.getByText('查询'));

    await waitFor(() => {
      expect(screen.getByText('暂无车次信息')).toBeInTheDocument();
    });
  });
});
