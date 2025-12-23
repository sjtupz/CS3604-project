import { render, screen, waitFor } from '@testing-library/react';
import DataPreviewPage from '../../src/pages/DataPreviewPage';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import * as trainsApi from '../../src/api/trains';
import userEvent from '@testing-library/user-event';

// Mock getTrains
vi.mock('../../src/api/trains', () => {
  return {
    getTrains: vi.fn(),
  };
});

describe('DataPreviewPage', () => {
  const mockTrainsSHSZ = [
    {
      trainNumber: 'G101',
      departureStation: '上海',
      arrivalStation: '苏州',
      departureTime: '08:00',
      arrivalTime: '08:30',
      duration: '00:30',
      price: 40,
      seatAvailability: { '二等座': { remaining: 100, hasSeatType: true } }
    },
    {
      trainNumber: 'D202',
      departureStation: '上海',
      arrivalStation: '苏州',
      departureTime: '09:00',
      arrivalTime: '09:40',
      duration: '00:40',
      price: 30,
      seatAvailability: { '二等座': { remaining: 50, hasSeatType: true } }
    }
  ];

  const mockTrainsSZSH = [
    {
      trainNumber: 'G102',
      departureStation: '苏州',
      arrivalStation: '上海',
      departureTime: '10:00',
      arrivalTime: '10:30',
      duration: '00:30',
      price: 40,
      seatAvailability: { '二等座': { remaining: 80, hasSeatType: true } }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (trainsApi.getTrains as any).mockImplementation((params: any) => {
        if (params.from === '上海') {
            return Promise.resolve({
                code: 200,
                data: { items: mockTrainsSHSZ }
            });
        }
        if (params.from === '苏州') {
            return Promise.resolve({
                code: 200,
                data: { items: mockTrainsSZSH }
            });
        }
        return Promise.resolve({ code: 200, data: { items: [] } });
    });
  });

  test('renders page and fetches data', async () => {
    render(
      <MemoryRouter>
        <DataPreviewPage />
      </MemoryRouter>
    );

    expect(screen.getByText('车票数据预览')).toBeInTheDocument();
    expect(screen.getByText('加载数据中...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('加载数据中...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('G101')).toBeInTheDocument();
    expect(screen.getByText('D202')).toBeInTheDocument();
    expect(screen.getByText('G102')).toBeInTheDocument();
    
    // Verify sections
    expect(screen.getByText('上海 → 苏州')).toBeInTheDocument();
    expect(screen.getByText('苏州 → 上海')).toBeInTheDocument();
    
    expect(trainsApi.getTrains).toHaveBeenCalledTimes(2);
  });

  test('switches route', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DataPreviewPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('上海 → 苏州')).toBeInTheDocument());

    // Switch to Beijing-Shanghai
    // There are two comboboxes. One for route, one for sort.
    // We added aria-label or label for them?
    // In component: <label>选择路线: </label><select ...>
    // So getByLabelText should work.
    
    const select = screen.getByLabelText(/选择路线/i);
    await user.selectOptions(select, '北京-上海');
    
    // Should trigger new fetch
    // Since we mocked only Shanghai/Suzhou, the next call might fail or return empty if not mocked.
    // Let's update mock to handle Beijing-Shanghai or just verify the call.
    // However, the component will re-fetch.
    
    await waitFor(() => {
        expect(trainsApi.getTrains).toHaveBeenCalledWith(expect.objectContaining({ from: '北京', to: '上海' }));
    });
  });

  test('sorts trains', async () => {
    render(
      <MemoryRouter>
        <DataPreviewPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('G101')).toBeInTheDocument());

    const user = userEvent.setup();
    // Default is asc time. G101 (08:00) before D202 (09:00).
    // The "Sort" select has two options. The button toggles order.
    // However, there are multiple selects on the page now (Route, Sort).
    // We should select by label or specific role.
    
    const sortBtn = screen.getByRole('button', { name: /升序/i }); 
    await user.click(sortBtn);

    // Now desc. D202 should be first in the Shanghai section.
    // The sections are separate, so we need to look within the first section.
    // But simply finding all train numbers is enough.
    // D202 is 09:00, G101 is 08:00. Descending -> D202, G101.
    
    const trains = screen.getAllByText(/G101|D202/);
    // Note: getByText might return elements in document order.
    // If layout is vertical list, top comes first.
    expect(trains[0]).toHaveTextContent('D202');
    expect(trains[1]).toHaveTextContent('G101');
  });
});
