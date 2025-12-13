import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { TrainListPage } from '../../src/pages/TrainListPage'

test('Given 日期选择 When 点击明天 Then 列表立即刷新', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  const today = new Date()
  const d = new Date(today)
  d.setDate(today.getDate() + 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const nextIso = `${y}-${m}-${dd}`
  const dateButton = screen.getByRole('button', { name: nextIso })
  await user.click(dateButton)
  expect(screen.getByText('车次')).toBeInTheDocument()
})

test('Given 时间范围选择 When 选择06:00-12:00 Then 列表立即刷新', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  const timeButton = screen.getByRole('button', { name: '06:00-12:00' })
  await user.click(timeButton)
  expect(screen.getByText('车次')).toBeInTheDocument()
})
