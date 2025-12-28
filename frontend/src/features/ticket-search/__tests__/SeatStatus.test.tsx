import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TicketSearch from '../TicketSearch'
import { vi } from 'vitest'
import { fetchTickets } from '../../services/ticketService'

const mockTickets = [
  {
    trainId: 1,
    trainNumber: 'G101',
    type: 'G',
    fromStation: '上海虹桥',
    toStation: '北京南',
    departureTime: '08:00',
    arrivalTime: '12:30',
    duration: '04:30',
    tickets: [
      { seatType: '商务座', price: 1800, count: 30 },
      { seatType: '特等座', price: 1500, count: 5 },
      { seatType: '一等座', price: 900, count: 0 },
      { seatType: '二等座', price: 550, count: 10 },
      { seatType: '软卧', price: 400, count: 2 },
      { seatType: '硬卧', price: 280, count: 0 },
      { seatType: '硬座', price: 150, count: 25 },
      { seatType: '无座', price: 150, count: 0 },
      { seatType: '其他', price: 200, count: 7 },
    ]
  }
]

vi.mock('../../services/ticketService', () => ({
  fetchTickets: vi.fn(async () => mockTickets)
}))

test('Seat status displays 有/无/余票：X张 for all seat types', async () => {
  render(<TicketSearch />)
  fireEvent.click(screen.getByText('查询'))

  await waitFor(() => {
    expect(screen.getByText('G101')).toBeInTheDocument()
  })

  expect(screen.getByText('商务座')).toBeInTheDocument()
  expect(screen.getByText('特等座')).toBeInTheDocument()
  expect(screen.getByText('一等座')).toBeInTheDocument()
  expect(screen.getByText('二等座')).toBeInTheDocument()
  expect(screen.getByText('软卧')).toBeInTheDocument()
  expect(screen.getByText('硬卧')).toBeInTheDocument()
  expect(screen.getByText('硬座')).toBeInTheDocument()
  expect(screen.getByText('无座')).toBeInTheDocument()
  expect(screen.getByText('其他')).toBeInTheDocument()

  expect(screen.getAllByText('有').length).toBeGreaterThan(0)
  expect(screen.getAllByText('无').length).toBeGreaterThan(0)
  expect(screen.getByText('余票：5张')).toBeInTheDocument()
})

// network error handling can be tested separately in integration suite
