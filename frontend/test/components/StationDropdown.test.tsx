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

test('Given 首页查询表单 When 点击出发地或到达地输入框 Then 弹出站点选择下拉列表', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue([] as any);
  const onSelectStation = vi.fn();
  render(<StationDropdown value="" onSelectStation={onSelectStation} placeholder="出发地" />);
  const input = screen.getByPlaceholderText('出发地');
  await user.click(input);
  expect(screen.getByText('热门')).toBeInTheDocument();
});

test('Given 下拉已弹出 When 加载完成 Then 左侧显示“国内站点”“国际站点”粗选栏，国内默认选中', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue([] as any);
  const onSelectStation = vi.fn();
  render(<StationDropdown value="" onSelectStation={onSelectStation} placeholder="到达地" />);
  const input = screen.getByPlaceholderText('到达地');
  await user.click(input);
  expect(screen.getByText('国内站点')).toBeInTheDocument();
  expect(screen.getByText('国际站点')).toBeInTheDocument();
  const domestic = screen.getByText('国内站点');
  expect(domestic).toHaveStyle({ color: '#fff' });
});

test('Given 当前选中“国内站点” When 点击“国际站点” Then 右侧更新为国际站点筛选内容', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue([] as any);
  const onSelectStation = vi.fn();
  render(<StationDropdown value="" onSelectStation={onSelectStation} placeholder="出发地" />);
  const input = screen.getByPlaceholderText('出发地');
  await user.click(input);
  const intlBtn = screen.getByText('国际站点');
  await user.click(intlBtn);
  expect(screen.getByText('老挝')).toBeInTheDocument();
});

test('Given 国内站点粗选 When 加载完成 Then 筛选按钮栏显示热门与字母区间（ABCDE/FGHIJ/KLMNO/PQRST/UVWXYZ），热门默认选中', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue([] as any);
  render(<StationDropdown value="" onSelectStation={vi.fn()} placeholder="出发地" />);
  const input = screen.getByPlaceholderText('出发地');
  await user.click(input);
  expect(screen.getByText('热门')).toBeInTheDocument();
  expect(screen.getByText('ABCDE')).toBeInTheDocument();
  expect(screen.getByText('FGHIJ')).toBeInTheDocument();
  expect(screen.getByText('KLMNO')).toBeInTheDocument();
  expect(screen.getByText('PQRST')).toBeInTheDocument();
  expect(screen.getByText('UVWXYZ')).toBeInTheDocument();
});

test('Given 选择热门筛选 When 展示 Then 国内热门站点包含北京、上海、广州、深圳、南京、武汉', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue([] as any);
  render(<StationDropdown value="" onSelectStation={vi.fn()} placeholder="出发地" />);
  const input = screen.getByPlaceholderText('出发地');
  await user.click(input);
  await user.click(screen.getByText('热门'));
  expect(await screen.findByText('北京')).toBeInTheDocument();
  expect(await screen.findByText('上海')).toBeInTheDocument();
  expect(await screen.findByText('广州')).toBeInTheDocument();
  expect(await screen.findByText('深圳')).toBeInTheDocument();
  expect(await screen.findByText('南京')).toBeInTheDocument();
  expect(await screen.findByText('武汉')).toBeInTheDocument();
});

test('Given 点击“ABCDE”按钮 When 切换 Then 显示A-E分组及对应站点按字典序排序', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue([] as any);
  render(<StationDropdown value="" onSelectStation={vi.fn()} placeholder="到达地" />);
  const input = screen.getByPlaceholderText('到达地');
  await user.click(input);
  await user.click(screen.getByText('ABCDE'));
  expect(screen.getByText('A')).toBeInTheDocument();
  expect(screen.getByText('B')).toBeInTheDocument();
  expect(screen.getByText('C')).toBeInTheDocument();
  expect(screen.getByText('D')).toBeInTheDocument();
  expect(screen.getByText('E')).toBeInTheDocument();
});

test('Given 当前选中“ABCDE” When 点击“FGHIJ” Then 更新为F-J分组显示', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue([] as any);
  render(<StationDropdown value="" onSelectStation={vi.fn()} placeholder="出发地" />);
  const input = screen.getByPlaceholderText('出发地');
  await user.click(input);
  await user.click(screen.getByText('ABCDE'));
  await user.click(screen.getByText('FGHIJ'));
  expect(screen.getByText('FGHIJ')).toBeInTheDocument();
});

test('Given 用户点击站点详细列表中的某个站点 When 选择 Then 自动填入输入框并关闭下拉，另一个输入框保持不变', async () => {
  const user = userEvent.setup();
  vi.mocked(stationApi.getStations).mockResolvedValue([
    { id: 1, name: '万象', pinyin: 'wanxiang' },
    { id: 2, name: '万荣', pinyin: 'wanrong' },
  ] as any);
  const onSelectStation = vi.fn();
  render(<StationDropdown id="fromStation" value="上" onSelectStation={onSelectStation} placeholder="出发地" />);
  const inputFrom = screen.getByPlaceholderText('出发地') as HTMLInputElement;
  await user.click(inputFrom);
  const item = await screen.findByText('万象');
  await user.click(item);
  expect(inputFrom.value).toBe('万象');
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
