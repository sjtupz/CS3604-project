import React from 'react'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TrainListPage } from '../../src/pages/TrainListPage'

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
      items: [
        {
          trainNumber: 'G108',
          departureStation: '上海',
          arrivalStation: '北京',
          departureTime: '08:00',
          arrivalTime: '12:00',
          duration: '4:00',
          seatAvailability: { 一等座: { remaining: 10 } },
        },
      ],
      pagination: { totalPages: 1 },
    },
  }),
}))

vi.mock('../../src/api/personal_user', () => ({
  getOrders: async () => ({ data: [] }),
}))

describe('TrainListPage 账号隔离测试', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockReset()
  })

  test('Different users should have isolated cancellation limits', async () => {
    const t = new Date()
    const today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
    
    // UserA has exceeded limits
    localStorage.setItem(
      'cancelOrderDailyStats_UserA',
      JSON.stringify({ date: today, normal: 3, noSeat: 0 })
    )
    
    // Current user is UserB (new user, no limits)
    localStorage.setItem('authToken', 'Bearer tokenB')
    localStorage.setItem('userId', 'UserB')

    const { unmount } = render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: '查询' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '预订' })).toBeInTheDocument()
    })

    // UserB should NOT be blocked
    fireEvent.click(screen.getByRole('button', { name: '预订' }))
    
    // Should navigate to booking page (mocked) or show selection, 
    // but definitely NOT show the limit popup.
    // The popup text contains "取消次数过多"
    expect(screen.queryByText(/取消次数过多/)).not.toBeInTheDocument()
    
    unmount()

    // Switch to UserA
    localStorage.setItem('authToken', 'Bearer tokenA')
    localStorage.setItem('userId', 'UserA')

    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: '查询' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '预订' })).toBeInTheDocument()
    })

    // UserA SHOULD be blocked
    fireEvent.click(screen.getByRole('button', { name: '预订' }))
    
    expect(screen.getByText(/取消次数过多/)).toBeInTheDocument()
  })
})
