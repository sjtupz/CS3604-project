import React from 'react'
import { describe, expect, test, vi } from 'vitest'
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

describe('TrainListPage 取消次数限制', () => {
  test('Given 当日取消次数过多 When 点击预订 Then 弹出限制弹窗并可跳转', async () => {
    mockNavigate.mockReset()
    try {
      const t = new Date()
      const today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
      localStorage.setItem('authToken', 'Bearer test')
      localStorage.setItem(
        'cancelOrderDailyStats',
        JSON.stringify({ date: today, normal: 3, noSeat: 0 })
      )
    } catch {}

    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: '查询' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '预订' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: '预订' }))

    expect(
      screen.getByText(
        '订票失败！原因:对不起，由于您取消次数过多，今日将不能继续受理您的订票请求。明日您可继续使用订票功能。请点击'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('[我的12306]')).toBeInTheDocument()
    expect(screen.getByText('[预订车票]')).toBeInTheDocument()

    fireEvent.click(screen.getByText('[我的12306]'))
    expect(mockNavigate).toHaveBeenCalledWith('/profile', { state: { section: '火车票订单' } })

    fireEvent.click(screen.getByText('[预订车票]'))
    expect(mockNavigate).toHaveBeenCalledWith('/tickets')
  })
})
