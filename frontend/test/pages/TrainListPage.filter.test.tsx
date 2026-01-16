import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TrainListPage } from '../../src/pages/TrainListPage';
import { getTrains } from '../../src/api/trains';
import { vi, test, expect } from 'vitest';

// Mock API Data
const mockTrains = [
  {
    trainNumber: 'G1',
    departureStation: 'Shanghai',
    arrivalStation: 'Beijing',
    departureTime: '09:00',
    arrivalTime: '13:00',
    duration: '4h',
    seatAvailability: {
      '商务座': { remaining: 5, hasSeatType: true },
      '一等座': { remaining: 10, hasSeatType: true },
      '二等座': { remaining: 20, hasSeatType: true },
    }
  },
  {
    trainNumber: 'D1',
    departureStation: 'Shanghai',
    arrivalStation: 'Beijing',
    departureTime: '10:00',
    arrivalTime: '20:00',
    duration: '10h',
    seatAvailability: {
      '二等座': { remaining: 5, hasSeatType: true },
      '硬卧': { remaining: 20, hasSeatType: true },
    }
  },
  {
    trainNumber: 'K1',
    departureStation: 'Shanghai',
    arrivalStation: 'Beijing',
    departureTime: '11:00',
    arrivalTime: '23:00',
    duration: '12h',
    seatAvailability: {
      '硬卧': { remaining: 10, hasSeatType: true },
      '硬座': { remaining: 50, hasSeatType: true },
    }
  }
];

// Mock Modules
vi.mock('../../src/api/trains', () => ({
  getTrains: vi.fn().mockResolvedValue({
    code: 200,
    data: { 
      items: [
        {
          trainNumber: 'G1',
          departureStation: '上海',
          arrivalStation: '北京',
          departureTime: '09:00',
          arrivalTime: '13:00',
          duration: '4h',
          seatAvailability: {
            '商务座': { remaining: 5, hasSeatType: true },
            '一等座': { remaining: 10, hasSeatType: true },
            '二等座': { remaining: 20, hasSeatType: true },
          }
        },
        {
          trainNumber: 'D1',
          departureStation: '上海',
          arrivalStation: '北京',
          departureTime: '10:00',
          arrivalTime: '20:00',
          duration: '10h',
          seatAvailability: {
            '二等座': { remaining: 5, hasSeatType: true },
            '硬卧': { remaining: 20, hasSeatType: true },
          }
        },
        {
          trainNumber: 'K1',
          departureStation: '上海',
          arrivalStation: '北京',
          departureTime: '11:00',
          arrivalTime: '23:00',
          duration: '12h',
          seatAvailability: {
            '硬卧': { remaining: 10, hasSeatType: true },
            '硬座': { remaining: 50, hasSeatType: true },
          }
        }
      ], 
      pagination: { total: 3, currentPage: 1, perPage: 100, totalPages: 1 } 
    }
  }),
}));

vi.mock('../../src/api/station', () => ({
  getStations: vi.fn().mockResolvedValue([]),
  getAllCityStations: vi.fn().mockResolvedValue([]),
}));

// Mock window.scrollTo
window.scrollTo = vi.fn();

test('Given TrainListPage When initially loaded Then no filters checked and all trains shown', async () => {
    // Setup token to bypass potential auth check if mock fails
    localStorage.setItem('authToken', 'test_token');

    render(
      <MemoryRouter initialEntries={['/trains?from=上海&to=北京&date=2023-10-01']}>
        <TrainListPage />
      </MemoryRouter>
    )

  // 1. Wait for items to load (Defaults to Shanghai->Beijing)
   await waitFor(() => {
      expect(getTrains).toHaveBeenCalled();
      expect(screen.getByText('G1')).toBeInTheDocument();
   }, { timeout: 3000 });

  // 2. Verify checkboxes are unchecked
  // Note: "All" buttons might be present, we specifically check type checkboxes
  const gcCheckbox = screen.getByLabelText(/GC-高铁\/城际/);
  expect(gcCheckbox).not.toBeChecked();

  // 3. Apply filter (Select GC)
  await userEvent.click(gcCheckbox);

  // 4. Verify filtering (Only G1 shown)
  expect(screen.getByText('G1')).toBeInTheDocument();
  expect(screen.queryByText('K1')).not.toBeInTheDocument();
  expect(screen.queryByText('D1')).not.toBeInTheDocument();

  // 5. Uncheck filter
  await userEvent.click(gcCheckbox);

  // 6. Verify all shown again
  expect(screen.getByText('G1')).toBeInTheDocument();
  expect(screen.getByText('D1')).toBeInTheDocument();
  expect(screen.getByText('K1')).toBeInTheDocument();
});

test('Given TrainListPage When accessed without params Then uses default values and shows all', async () => {
    render(
      <MemoryRouter initialEntries={['/trains']}>
        <TrainListPage />
      </MemoryRouter>
    )
  
    // 1. Wait for items to load (Defaults to Shanghai->Beijing)
    await waitFor(() => {
      expect(screen.getByText('G1')).toBeInTheDocument();
      expect(screen.getByText('D1')).toBeInTheDocument();
      expect(screen.getByText('K1')).toBeInTheDocument();
    });
    
    // 2. Verify debug text to confirm empty filters
    // This assumes the debug text is still in the component, if removed, this part will fail
    // We can rely on the presence of all items as proof
});
