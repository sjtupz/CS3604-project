import { test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StationDropdown } from '../../src/components/StationDropdown';
import * as stationApi from '../../src/api/station';

// Mock the API module
vi.mock('../../src/api/station', () => ({
  getStations: vi.fn(),
  getAllCityStations: vi.fn(async () => [
    {
      province: '北京',
      cities: [
        {
          city: '北京',
          pinyin: 'beijing',
          stations: [
            { name: '北京', code: 'BJ' },
          ],
        },
      ],
    },
    {
      province: '老挝',
      cities: [
        {
          city: '老挝',
          pinyin: 'laowo',
          stations: [
            { name: '万象', code: 'WX' },
            { name: '万荣', code: 'WR' },
          ],
        },
      ],
    },
  ]),
}));

test('Given domestic region is selected, international stations like Wanxiang should NOT appear in pinyin list', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue([]);

  render(<StationDropdown value="" onSelectStation={vi.fn()} placeholder="出发地" />);
  
  const input = screen.getByPlaceholderText('出发地');
  await user.click(input);

  // Default is Domestic
  expect(screen.getByText('国内站点')).toHaveStyle({ backgroundColor: '#437ff7' }); // Check if active style is applied (approximate check based on class/style logic)

  // Click UVWXYZ tab
  const tab = screen.getByText('UVWXYZ');
  await user.click(tab);

  // Wanxiang (WX) should NOT be visible under W
  // We expect 'W' header to be present if there are other W stations, but since we only mocked Wanxiang, 
  // if filtered correctly, Wanxiang should not be there.
  
  // Wait for any potential rendering
  await waitFor(() => {
     const wanxiang = screen.queryByText('万象');
     expect(wanxiang).not.toBeInTheDocument();
  });
  
  const wanrong = screen.queryByText('万荣');
  expect(wanrong).not.toBeInTheDocument();
});
