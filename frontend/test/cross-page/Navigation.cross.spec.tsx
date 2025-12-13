/**
 * Cross-Page Navigation & Data Flow Test Suite
 * 
 * 业务场景 (Business Scenarios):
 * 1. 单程票搜索 (One-way Trip Search):
 *    Home Page -> Input [From, To, Date] -> Click Query -> Navigate to /tickets -> Verify URL Params
 * 
 * 2. 往返票搜索 (Round-trip Search):
 *    Home Page -> Select Round Trip -> Input [From, To, Date, Return Date] -> Click Query -> Navigate to /tickets -> Verify URL Params (incl. returnDate)
 * 
 * 3. 数据一致性 (Data Consistency):
 *    Home Page Input == Train List Page Display/Query
 * 
 * 4. 边界条件 (Boundary Conditions):
 *    - Same Origin & Destination -> Block Navigation & Show Error
 *    - Past Date -> Block Navigation & Show Error
 * 
 * Data Flow:
 * [Home Page] --(URL Params)--> [Train List Page] --(API Params)--> [Backend API]
 * 
 * Current Status: GREEN (Passing) - Implementation Complete
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../../src/App';
import * as personalUserApi from '../../src/api/personal_user';
import * as stationApi from '../../src/api/station';

// Mock the APIs
vi.mock('../../src/api/personal_user');
vi.mock('../../src/api/station');
vi.mock('../../src/api/trains', () => ({
  queryTickets: vi.fn().mockResolvedValue({ outbound_tickets: [] }),
  getTrains: vi.fn().mockResolvedValue({ outbound_tickets: [] }),
}));

// Helper component to track location
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}{decodeURIComponent(location.search)}</div>;
};

describe('E2E Scenario: Cross-Page Booking Flow (Red Stage)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock station data
    (stationApi.getAllCityStations as any).mockResolvedValue([
      {
        initial: 'S',
        stations: [{ name: '上海', code: 'SHH', pinyin: 'shanghai' }]
      },
      {
        initial: 'B',
        stations: [{ name: '北京', code: 'BJP', pinyin: 'beijing' }]
      }
    ]);
    (personalUserApi.getUserInfo as any).mockResolvedValue({});
    
    // Mock window.alert
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  const renderApp = () => {
    return render(
      <MemoryRouter initialEntries={['/']}>
         <App />
         <LocationDisplay />
      </MemoryRouter>
    );
  };

  const getQueryButton = () => {
    const homePage = screen.getByTestId('home-page');
    return within(homePage).getByRole('button', { name: /查询/i });
  };

  it('Step 1: One-way Trip Search -> Navigate to Ticket List', async () => {
    renderApp();

    // 1. Fill inputs
    const fromInput = screen.getByLabelText(/出发地/i);
    fireEvent.change(fromInput, { target: { value: '上海' } });
    
    const toInput = screen.getByLabelText(/到达地/i);
    fireEvent.change(toInput, { target: { value: '北京' } });

    const dateInput = screen.getByLabelText(/出发日期/i);
    // Ensure we pick a future date to avoid validation error
    fireEvent.change(dateInput, { target: { value: '2025-12-14' } });

    // 2. Click Query
    const queryBtn = getQueryButton();
    fireEvent.click(queryBtn);

    // 3. Expect Navigation
    // This assertion MUST FAIL because navigation is not implemented yet
    await waitFor(() => {
      const locationText = screen.getByTestId('location-display').textContent;
      expect(locationText).toContain('/tickets');
      expect(locationText).toContain('from=上海');
      expect(locationText).toContain('to=北京');
      expect(locationText).toContain('date=2025-12-14');
    });
  });

  it('Step 2: Round-trip Search -> Navigate to Ticket List', async () => {
    renderApp();

    // 1. Select Round Trip
    const roundTripRadio = screen.getByLabelText(/往返/i);
    fireEvent.click(roundTripRadio);

    // 2. Fill inputs
    const fromInput = screen.getByLabelText(/出发地/i);
    fireEvent.change(fromInput, { target: { value: '上海' } });
    
    const toInput = screen.getByLabelText(/到达地/i);
    fireEvent.change(toInput, { target: { value: '北京' } });

    const dateInput = screen.getByLabelText(/出发日期/i);
    fireEvent.change(dateInput, { target: { value: '2025-12-14' } });

    const returnDateInput = screen.getByLabelText(/返程日期/i);
    fireEvent.change(returnDateInput, { target: { value: '2025-12-20' } });

    // 3. Click Query
    const queryBtn = getQueryButton();
    fireEvent.click(queryBtn);

    // 4. Expect Navigation
    // This assertion MUST FAIL
    await waitFor(() => {
      const locationText = screen.getByTestId('location-display').textContent;
      expect(locationText).toContain('/tickets');
      expect(locationText).toContain('from=上海');
      expect(locationText).toContain('to=北京');
      expect(locationText).toContain('date=2025-12-14');
      expect(locationText).toContain('returnDate=2025-12-20');
    });
  });

  it('Step 3: Data Consistency (Implicit Check)', async () => {
    // This test verifies that IF we navigate, the target page renders components that reflect the search.
    // Since we don't have the implementation, we can just check if we are on the page.
    // A better check would be to see if the API was called with correct params if the page loaded.
    // But since navigation fails, this test will also fail.
    
    renderApp();
    const fromInput = screen.getByLabelText(/出发地/i);
    fireEvent.change(fromInput, { target: { value: '上海' } });
    const toInput = screen.getByLabelText(/到达地/i);
    fireEvent.change(toInput, { target: { value: '北京' } });
    const dateInput = screen.getByLabelText(/出发日期/i);
    fireEvent.change(dateInput, { target: { value: '2025-12-14' } });
    
    const queryBtn = getQueryButton();
    fireEvent.click(queryBtn);

    await waitFor(() => {
       expect(screen.getByTestId('location-display')).toHaveTextContent(/\/tickets/);
    });
  });

  it('Step 4: Boundary Conditions - Same Station', async () => {
    renderApp();
    const fromInput = screen.getByLabelText(/出发地/i);
    fireEvent.change(fromInput, { target: { value: '上海' } });
    
    const toInput = screen.getByLabelText(/到达地/i);
    fireEvent.change(toInput, { target: { value: '上海' } }); // Same station

    const dateInput = screen.getByLabelText(/出发日期/i);
    fireEvent.change(dateInput, { target: { value: '2025-12-14' } });

    const queryBtn = getQueryButton();
    fireEvent.click(queryBtn);

    // Expect alert or NO navigation
    // Currently implementation might do nothing or navigate?
    // User requirement: "System should show 'Source and destination cannot be same' hint"
    // Since this logic is "not implemented", we expect this test to fail if we assert the presence of the hint.
    // Or if we assume the current implementation DOES navigate (it shouldn't), we assert it stays on page.
    
    // Let's assert that an error message is displayed (Red state: it won't be displayed).
    // Or we can check if window.alert was called if that's the intended UI. 
    // The requirement says "Show hint". TicketQueryForm has some validation logic but maybe not this one.
    
    // I'll check if the form validation logic already covers this.
    // TicketQueryForm.tsx only checks if fields are empty. It does NOT check if they are equal.
    // So current code will proceed to (attempt) query.
    
    // I will assert that we do NOT navigate, OR that an error message is shown.
    // Since I want a failing test for TDD, I will assert that an error message "出发地和目的地不能相同" is visible.
    
    await waitFor(() => {
       expect(screen.queryByText(/出发地和目的地不能相同/i)).toBeInTheDocument();
    });
  });
  
  it('Step 4: Boundary Conditions - Past Date', async () => {
      renderApp();
      const fromInput = screen.getByLabelText(/出发地/i);
      fireEvent.change(fromInput, { target: { value: '上海' } });
      const toInput = screen.getByLabelText(/到达地/i);
      fireEvent.change(toInput, { target: { value: '北京' } });
      
      const dateInput = screen.getByLabelText(/出发日期/i);
      fireEvent.change(dateInput, { target: { value: '2020-01-01' } }); // Past date
      
      const queryBtn = getQueryButton();
      fireEvent.click(queryBtn);
      
      // Expect error message "无效日期" or similar.
      await waitFor(() => {
         expect(screen.queryByText(/无效日期|早于当前日期/i)).toBeInTheDocument();
      });
  });

});
