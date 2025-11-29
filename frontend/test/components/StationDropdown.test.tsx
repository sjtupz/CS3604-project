import { test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StationDropdown } from '../../src/components/StationDropdown';
import * as stationApi from '../../src/api/station';

const mockStations = [
  { id: 1, name: 'Beijing', pinyin: 'beijing' },
  { id: 2, name: 'Shanghai', pinyin: 'shanghai' },
  { id: 3, name: 'Guangzhou', pinyin: 'guangzhou' },
];

// Mock the API module
vi.mock('../../src/api/station', () => ({
  getStations: vi.fn(),
}));

test('Given user types a non-existent station, when the input loses focus, then the input should be cleared', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue(mockStations);

  const onSelectStation = vi.fn();
  render(<StationDropdown value="" onSelectStation={onSelectStation} placeholder="出发地" />);

  const input = screen.getByPlaceholderText('出发地');
  await user.type(input, 'nonexistent-station');

  // Lose focus
  await fireEvent.blur(input);

  expect(input.value).toBe('');
});

test('Given user types a non-existent station, then it should show "无法匹配任何站点" in dropdown', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue(mockStations);

  const onSelectStation = vi.fn();
  render(<StationDropdown value="" onSelectStation={onSelectStation} placeholder="出发地" />);

  const input = screen.getByPlaceholderText('出发地');
  await user.type(input, 'nonexistent-station');

  const noMatchMessage = await screen.findByText('无法匹配任何站点');
  expect(noMatchMessage).toBeInTheDocument();
});