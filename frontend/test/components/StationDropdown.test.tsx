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

// Mock the API module（包含城市-车站分级数据）
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
            { name: '北京南', code: 'BJN' },
          ],
        },
      ],
    },
    {
      province: '上海',
      cities: [
        {
          city: '上海',
          pinyin: 'shanghai',
          stations: [
            { name: '上海', code: 'SH' },
            { name: '上海虹桥', code: 'SHHQ' },
          ],
        },
      ],
    },
  ]),
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

test('Given search results When click station Then select triggers', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue([
    { id: 1, name: '上海', pinyin: 'shanghai' },
    { id: 2, name: '上海虹桥', pinyin: 'shanghaihongqiao' },
  ] as any);

  const onSelectStation = vi.fn();
  render(<StationDropdown value="" onSelectStation={onSelectStation} placeholder="出发地" />);

  const input = screen.getByPlaceholderText('出发地');
  await user.type(input, '上海虹桥');
  const item = await screen.findByText('上海虹桥');
  await user.click(item);

  expect(onSelectStation).toHaveBeenCalledWith('上海虹桥');
});

test('Given rapid clicks When select station twice Then selection stable', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue([
    { id: 1, name: '北京南', pinyin: 'beijingnan' },
  ] as any);

  const onSelectStation = vi.fn();
  render(<StationDropdown value="北京" onSelectStation={onSelectStation} placeholder="出发地" />);

  const input = screen.getByPlaceholderText('出发地');
  await user.type(input, '北京南');
  const item = await screen.findByText('北京南');
  await user.dblClick(item);

  expect(onSelectStation).toHaveBeenCalledWith('北京南');
});

test('Given click 热门 tab When show hot cities Then can select', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue(mockStations as any);
  const onSelectStation = vi.fn();
  render(<StationDropdown value="" onSelectStation={onSelectStation} placeholder="目的地" />);
  // 聚焦打开下拉弹窗
  const inputHot = screen.getByPlaceholderText('目的地') as HTMLInputElement;
  fireEvent.focus(inputHot);
  const hotTab = await screen.findByText('热门');
  await user.click(hotTab);
  // Hot city list should include 北京/上海 from test data
  expect(await screen.findByText('北京')).toBeInTheDocument();
  expect(await screen.findByText('上海')).toBeInTheDocument();
  // Click city then station path
  const shCity = screen.getByText('上海');
  await user.click(shCity);
  // Input should be filled and dropdown closed
  expect(inputHot.value).toBe('上海');
  // dropdown should be removed from DOM
  const tabsHot = screen.queryByText('热门');
  expect(tabsHot).toBeNull();
});
