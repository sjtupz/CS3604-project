import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, test, expect } from 'vitest'
import { TrainListPage } from '../../src/pages/TrainListPage'

// 避免复杂组件内部useEffect触发act警告：仅保留必要渲染
vi.mock('../../src/components/TrainFilterBar', () => ({
  TrainFilterBar: () => <div data-testid="train-filter-bar">FilterBar</div>
}))
vi.mock('../../src/components/StationDropdown', () => ({
  StationDropdown: ({ id, value, onSelectStation }: any) => (
    <input data-testid={id} value={value} onChange={(e) => onSelectStation(e.target.value)} />
  )
}))

describe('TrainListPage 日期范围', () => {
  test('Given 系统日期为2024-12-25 When 渲染 Then 出发日min=当天、max=+15天', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 11, 25, 9, 0, 0)) // 2024-12-25
    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )
    const departDate = screen.getByTestId('date-picker-input')
    expect(departDate).toHaveAttribute('min', '2024-12-25')
    expect(departDate).toHaveAttribute('max', '2025-01-09')
    vi.useRealTimers()
  })

  test('Given 跨月场景2025-01-28 When 渲染 Then max正确跨至2月', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 28, 10, 0, 0)) // 2025-01-28
    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )
    const departDate = screen.getByTestId('date-picker-input')
    expect(departDate).toHaveAttribute('min', '2025-01-28')
    expect(departDate).toHaveAttribute('max', '2025-02-12')
    vi.useRealTimers()
  })
})
