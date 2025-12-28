import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { TrainListPage } from '../../src/pages/TrainListPage'
import { waitFor } from '@testing-library/react'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../src/api/trains', () => ({
  getTrains: async () => ({
    data: {
      items: [{
        trainNumber: 'G108',
        departureStation: '上海',
        arrivalStation: '北京',
        departureTime: '08:00',
        arrivalTime: '12:00',
        duration: '4:00',
        seatAvailability: { 一等座: { remaining: 10 } }
      }],
      pagination: { totalPages: 1 }
    }
  })
}))

test('Given 未登录用户 When 查询后点击备注列预订 Then 跳转登录页', async () => {
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  const queryButton = screen.getByRole('button', { name: '查询' })
  fireEvent.click(queryButton)
  await waitFor(() => {
    expect(screen.getByRole('button', { name: '预订' })).toBeInTheDocument()
  })
  const reserveButton = screen.getByRole('button', { name: '预订' })
  fireEvent.click(reserveButton)
  expect(mockNavigate).toHaveBeenCalledWith('/login')
}, 15000)

test('Given 已登录用户 When 查询后点击备注列预订 Then 跳转订单填写页', async () => {
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  const queryButton = screen.getByRole('button', { name: '查询' })
  fireEvent.click(queryButton)
  await waitFor(() => {
    expect(screen.getByRole('button', { name: '预订' })).toBeInTheDocument()
  })
  const reserveButton = screen.getByRole('button', { name: '预订' })
  fireEvent.click(reserveButton)
  expect(mockNavigate).toHaveBeenCalledWith('/orders/new')
}, 15000)
