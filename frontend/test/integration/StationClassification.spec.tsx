import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TrainListPage } from '../../src/pages/TrainListPage'
import { MemoryRouter } from 'react-router-dom'
import * as trainApi from '../../src/api/trains'
import * as stationApi from '../../src/api/station'

// Mock APIs
vi.mock('../../src/api/trains', () => ({
  getTrains: vi.fn()
}))

vi.mock('../../src/api/station', () => ({
  getStations: vi.fn()
}))

// Mock Footer
vi.mock('../../src/components/Footer', () => ({
  Footer: () => <div data-testid="footer">Footer Mock</div>
}))

describe('Station Classification Integration', () => {
  const mockTrains = [
    {
      trainNumber: 'G100',
      departureStation: '上海松江',
      arrivalStation: '北京丰台',
      departureTime: '08:00',
      arrivalTime: '12:00',
      duration: '4h',
      seatAvailability: {
        '二等座': { hasSeatType: true, remaining: 10, price: 500 }
      }
    },
    {
      trainNumber: 'G101',
      departureStation: '上海虹桥',
      arrivalStation: '北京南',
      departureTime: '09:00',
      arrivalTime: '13:00',
      duration: '4h',
      seatAvailability: {
        '二等座': { hasSeatType: true, remaining: 10, price: 500 }
      }
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    ;(trainApi.getTrains as any).mockResolvedValue({
      code: 200,
      data: { items: mockTrains }
    })
    // Even if getStations returns empty or basic list, the client-side mapping should add the new stations
    ;(stationApi.getStations as any).mockResolvedValue([
      { name: '上海虹桥' },
      { name: '上海' },
      { name: '上海松江' }, // Mocking API return to be safe, though mapping handles it
      { name: '北京南' },
      { name: '北京丰台' }
    ])
  })

  it('should include new stations in the filter list when searching for major cities', async () => {
    render(
      <MemoryRouter initialEntries={['/trains?from=上海&to=北京&date=2025-12-23']}>
        <TrainListPage />
      </MemoryRouter>
    )

    // Wait for initial load
    await waitFor(() => expect(screen.getByText('G100')).toBeInTheDocument())

    // Verify "上海松江" is present in Departure Stations
    await waitFor(() => {
        expect(screen.getByLabelText('上海松江')).toBeInTheDocument()
    })

    // Verify "北京丰台" is present in Arrival Stations
    await waitFor(() => {
        expect(screen.getByLabelText('北京丰台')).toBeInTheDocument()
    })
  })

  it('should correctly filter trains from Shanghai Songjiang', async () => {
    render(
      <MemoryRouter initialEntries={['/trains?from=上海&to=北京&date=2025-12-23']}>
        <TrainListPage />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByText('G100')).toBeInTheDocument())
    expect(screen.getByText('G101')).toBeInTheDocument()

    // Unselect "上海虹桥" (assuming all are selected by default)
    // Actually, let's select "上海松江" explicitly.
    // First, click "All" to deselect everything.
    const allBtns = screen.getAllByText('全部')
    fireEvent.click(allBtns[1]) // Departure stations All button (index 1? 0 is Types, 1 is From, 2 is To, 3 is Seats)
    
    // Check indices in TrainFilterBar:
    // 0: Train Types
    // 1: Departure Stations
    // 2: Arrival Stations
    // 3: Seat Types
    
    // Wait for update
    await waitFor(() => {
        expect(screen.queryByText('G100')).not.toBeInTheDocument()
    })

    // Select "上海松江"
    fireEvent.click(screen.getByLabelText('上海松江'))

    // G100 (Songjiang) should appear, G101 (Hongqiao) should not
    await waitFor(() => {
        expect(screen.getByText('G100')).toBeInTheDocument()
    })
    expect(screen.queryByText('G101')).not.toBeInTheDocument()
  })
})
