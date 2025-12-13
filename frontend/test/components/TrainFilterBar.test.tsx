import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TrainFilterBar } from '../../src/components/TrainFilterBar'
import { vi } from 'vitest'

test('Given 今日起至+15天范围 When 点击明天 Then 触发回调并刷新列表', async () => {
  const user = userEvent.setup()
  const onDateChange = vi.fn()
  const onTimeRangeChange = vi.fn()
  render(<TrainFilterBar selectedDate="2025-12-25" timeRange="00:00-24:00" onDateChange={onDateChange} onTimeRangeChange={onTimeRangeChange} />)
  const today = new Date()
  const d = new Date(today)
  d.setDate(today.getDate() + 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const nextIso = `${y}-${m}-${dd}`
  const dateButton = screen.getByRole('button', { name: nextIso })
  await user.click(dateButton)
  expect(onDateChange).toHaveBeenCalledWith(nextIso)
  const timeButton = screen.getByRole('button', { name: '06:00-12:00' })
  await user.click(timeButton)
  expect(onTimeRangeChange).toHaveBeenCalledWith('06:00-12:00')

  // 验证提示文案：可选日期范围：YYYY-MM-DD至YYYY-MM-DD
  const start = new Date(today)
  const end = new Date(today)
  end.setDate(start.getDate() + 15)
  const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`
  const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`
  expect(screen.getByText(`可选日期范围：${startStr}至${endStr}`)).toBeInTheDocument()
})
