import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
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

// Mock Footer to avoid rendering issues if any
vi.mock('../../src/components/Footer', () => ({
  Footer: () => <div data-testid="footer">Footer Mock</div>
}))

describe('Station Filter Integration', () => {
  const mockTrains = [
    {
      trainNumber: 'G1',
      departureStation: '上海虹桥',
      arrivalStation: '北京南',
      departureTime: '09:00',
      arrivalTime: '13:00',
      duration: '4h',
      seatAvailability: {
        '二等座': { hasSeatType: true, remaining: 10, price: 500 }
      }
    },
    {
      trainNumber: 'G2',
      departureStation: '上海',
      arrivalStation: '北京南',
      departureTime: '10:00',
      arrivalTime: '14:00',
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
    ;(stationApi.getStations as any).mockResolvedValue([
      { name: '上海虹桥' },
      { name: '上海' }
    ])
  })

  it('should filter trains when specific station is selected', async () => {
    render(
      <MemoryRouter initialEntries={['/trains?from=上海&to=北京&date=2025-12-23']}>
        <TrainListPage />
      </MemoryRouter>
    )

    // Wait for initial load
    await waitFor(() => expect(screen.getByText('G1')).toBeInTheDocument())
    expect(screen.getByText('G2')).toBeInTheDocument()

    // Find filter checkboxes
    // Wait for stations to load in Filter Bar
    await waitFor(() => expect(screen.getByLabelText('上海虹桥')).toBeInTheDocument())

    // Initial state: All selected (undefined prop -> auto-select all in component)
    // Both trains visible.

    // Click '上海虹桥' to uncheck it? No, initial click usually toggles?
    // Wait, if auto-selected, clicking it toggles it OFF.
    // If I want to see ONLY '上海虹桥', I should uncheck others.
    // Or if I click 'All' to unselect all, then click '上海虹桥'.
    
    // Let's click '上海' to uncheck it.
    fireEvent.click(screen.getByLabelText('上海'))

    // Now '上海' is unchecked. '上海虹桥' is checked.
    // List should show G1 (上海虹桥), hide G2 (上海).
    
    await waitFor(() => {
      expect(screen.queryByText('G2')).not.toBeInTheDocument()
    })
    expect(screen.getByText('G1')).toBeInTheDocument()
  })

  it('should show all trains when "All" is selected', async () => {
    render(
      <MemoryRouter initialEntries={['/trains?from=上海&to=北京&date=2025-12-23']}>
        <TrainListPage />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByText('G1')).toBeInTheDocument())

    // Uncheck everything
    // Find "All" button
    const rows = screen.getAllByText('出发车站')
    const row = rows[0].closest('.switch-row')
    const allBtn = within(row as HTMLElement).getByText('全部')

    // Current state: All selected.
    // Click All -> Select None.
    fireEvent.click(allBtn)

    // Select None -> List should be empty
    await waitFor(() => {
      expect(screen.queryByText('G1')).not.toBeInTheDocument()
      expect(screen.queryByText('G2')).not.toBeInTheDocument()
    })
    
    // If I want to verify filtering, I should check one.
    fireEvent.click(screen.getByLabelText('上海虹桥'))
    // Now ['上海虹桥'] selected.
    await waitFor(() => expect(screen.getByText('G1')).toBeInTheDocument())
    expect(screen.queryByText('G2')).not.toBeInTheDocument()
    
    // Click All -> Select All
    fireEvent.click(allBtn)
    // Now all selected.
    await waitFor(() => {
      expect(screen.getByText('G1')).toBeInTheDocument()
      expect(screen.getByText('G2')).toBeInTheDocument()
    })
  })
})
