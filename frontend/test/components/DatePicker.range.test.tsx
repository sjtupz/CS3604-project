import { render, screen } from '@testing-library/react'
import { vi, describe, test, expect } from 'vitest'
import { DatePicker } from '../../src/components/DatePicker'

describe('DatePicker 日期范围', () => {
  test('Given 系统时间23:59 When 渲染 Then min为当天', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 10, 23, 59, 0)) // 2025-01-10 23:59
    render(<DatePicker onDateSelect={() => {}} id="dp" />)
    const input = screen.getByTestId('date-picker-input')
    expect(input).toHaveAttribute('min', '2025-01-10')
    vi.useRealTimers()
  })

  test('Given 闰年2月29日 When 渲染 Then min为2024-02-29', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 1, 29, 12, 0, 0)) // 2024-02-29 12:00
    render(<DatePicker onDateSelect={() => {}} id="dp2" />)
    const input = screen.getByTestId('date-picker-input')
    expect(input).toHaveAttribute('min', '2024-02-29')
    vi.useRealTimers()
  })
})
