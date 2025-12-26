import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, test, expect } from 'vitest'
import { TrainFilterBar } from '../../src/components/TrainFilterBar'
import { getStations } from '../../src/api/station'

vi.mock('../../src/api/station', async () => {
  const actual = await vi.importActual<any>('../../src/api/station')
  return {
    ...actual,
    getStations: vi.fn(async (search?: string) => {
      const all = [
        { id: 1, name: '上海', pinyin: 'shanghai', city: '上海', code: 'SH' },
        { id: 2, name: '上海虹桥', pinyin: 'shanghaihongqiao', city: '上海', code: 'SHHQ' },
        { id: 3, name: '北京', pinyin: 'beijing', city: '北京', code: 'BJ' },
        { id: 4, name: '北京南', pinyin: 'beijingnan', city: '北京', code: 'BJN' },
      ]
      if (!search) return all
      const lower = String(search).toLowerCase()
      return all.filter(s => (s.name || '').toLowerCase().includes(lower) || (s.pinyin || '').toLowerCase().includes(lower))
    })
  }
})

test('Given 选择了出发/到达地 When 加载筛选栏站点 Then 展示匹配的车站名称', async () => {
  const user = userEvent.setup()
  render(
    <TrainFilterBar
      selectedDate={'2025-12-25'}
      timeRange={'00:00-24:00'}
      onDateChange={() => {}}
      onTimeRangeChange={() => {}}
      fromStation={'上海'}
      toStation={'北京'}
      onFromStationsChange={() => {}}
      onToStationsChange={() => {}}
    />
  )

  // 出发车站与到达车站的候选项
  expect(await screen.findByText('上海虹桥')).toBeInTheDocument()
  expect(await screen.findByText('北京南')).toBeInTheDocument()

  // 选择一个候选项应调用父回调（这里通过点击触发）
  const shhq = screen.getByText('上海虹桥')
  await user.click(shhq)
})

test('Given 已加载站点筛选 When 清空出发地 Then 不展示全量车站候选', async () => {
  const { rerender } = render(
    <TrainFilterBar
      selectedDate={'2025-12-25'}
      timeRange={'00:00-24:00'}
      onDateChange={() => {}}
      onTimeRangeChange={() => {}}
      fromStation={'上海'}
      toStation={'北京'}
      onFromStationsChange={() => {}}
      onToStationsChange={() => {}}
    />
  )

  await screen.findByText('上海虹桥')

  const depRowBefore = screen.getByText('出发车站').closest('.switch-row')
  expect(depRowBefore).not.toBeNull()
  expect(within(depRowBefore!).queryByText('北京南')).toBeNull()

  rerender(
    <TrainFilterBar
      selectedDate={'2025-12-25'}
      timeRange={'00:00-24:00'}
      onDateChange={() => {}}
      onTimeRangeChange={() => {}}
      fromStation={''}
      toStation={'北京'}
      onFromStationsChange={() => {}}
      onToStationsChange={() => {}}
    />
  )

  await waitFor(() => {
    expect(vi.mocked(getStations).mock.calls.some(([s]) => s === '')).toBe(false)
  })

  const depRowAfter = screen.getByText('出发车站').closest('.switch-row')
  expect(depRowAfter).not.toBeNull()
  expect(within(depRowAfter!).getByText('上海虹桥')).toBeInTheDocument()
  expect(within(depRowAfter!).queryByText('北京南')).toBeNull()
})

