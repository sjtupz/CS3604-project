/**
 * @fileoverview The main component for the Ticket List page.
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FilterBar, FilterState } from '../../components/TicketFilterBar/FilterBar';
// import { Pagination } from '../../components/common/Pagination'; // Placeholder for pagination component
// import { api } from '../../services/api'; // Placeholder for API client

// --- Type Definitions (as per tech spec) ---

export interface SeatInfo {
  type: string;
  status: '有' | '候补' | number | '-';
  price: number | null;
}

export interface Ticket {
  trainNo: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  arrivalType: '当日到达' | '次日到达';
  seats: SeatInfo[];
}

export interface TicketsState {
  isLoading: boolean;
  error: string | null;
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  tickets: Ticket[];
}

const initialTicketsState: TicketsState = {
  isLoading: false,
  error: null,
  meta: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  },
  tickets: [],
};

/**
 * TicketList Page Component
 * @returns {React.ReactElement} The rendered component.
 */
export const TicketList: React.FC = () => {
  const [ticketsState, setTicketsState] = useState<TicketsState>(initialTicketsState);
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Fetches ticket data from the API based on current filters and page.
   */
  const fetchTickets = useCallback(async () => {
    setTicketsState(prevState => ({ ...prevState, isLoading: true, error: null }));
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/v1/tickets', { ...filters, page: currentPage });
      // setTicketsState({ isLoading: false, error: null, ...response.data });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      const mockResponse = {
        meta: { totalItems: 1, totalPages: 1, currentPage: 1, pageSize: 10 },
        data: [
          {
            trainNo: 'G108',
            fromStation: '北京南',
            toStation: '上海虹桥',
            departureTime: '09:00',
            arrivalTime: '13:29',
            duration: '4小时29分钟',
            arrivalType: '当日到达',
            seats: [
              { type: '一等座', status: 15, price: 933.0 },
              { type: '二等座', status: '有', price: 553.0 },
            ],
          },
        ],
      };
      setTicketsState({ isLoading: false, error: null, ...mockResponse });

    } catch (err) {
      setTicketsState(prevState => ({ ...prevState, isLoading: false, error: 'Failed to fetch tickets.' }));
    }
  }, [filters, currentPage]);

  // Effect to trigger API call when filters or page change
  useEffect(() => {
    // fetchTickets(); // TODO: Uncomment when API is ready
  }, [fetchTickets]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>车次列表</h1>
      <FilterBar onFilterChange={handleFilterChange} />
      
      {ticketsState.isLoading && <div>Loading...</div>}
      {ticketsState.error && <div style={{ color: 'red' }}>{ticketsState.error}</div>}
      
      {!ticketsState.isLoading && !ticketsState.error && (
        <>
          <ul>
            {ticketsState.tickets.map(ticket => (
              <li key={ticket.trainNo}>{ticket.trainNo} - {ticket.fromStation} to {ticket.toStation}</li>
            ))}
          </ul>
          {/* <Pagination 
            currentPage={ticketsState.meta.currentPage}
            totalPages={ticketsState.meta.totalPages}
            onPageChange={handlePageChange}
          /> */}
        </>
      )}
    </div>
  );
};