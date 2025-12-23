import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TrainFilterBar } from '../../src/components/TrainFilterBar'
import * as stationApi from '../../src/api/station'

// Mock getStations
vi.mock('../../src/api/station', () => ({
  getStations: vi.fn()
}))

describe('TrainFilterBar Station Filtering', () => {
  const mockOnFromStationsChange = vi.fn()
  const mockOnToStationsChange = vi.fn()
  const defaultProps = {
    selectedDate: '2023-10-01',
    timeRange: '',
    onDateChange: vi.fn(),
    onTimeRangeChange: vi.fn(),
    fromStation: '上海',
    toStation: '北京',
    selectedFromStations: undefined, // Initial state
    onFromStationsChange: mockOnFromStationsChange,
    onToStationsChange: mockOnToStationsChange,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock getStations to return Shanghai stations
    ;(stationApi.getStations as any).mockResolvedValue([
      { name: '上海虹桥' },
      { name: '上海南' },
      { name: '上海' },
      { name: '上海西' }
    ])
  })

  it('should render station checkboxes correctly', async () => {
    render(<TrainFilterBar {...defaultProps} />)
    
    // Wait for stations to load
    await waitFor(() => {
      expect(screen.getByLabelText('上海虹桥')).toBeInTheDocument()
      expect(screen.getByLabelText('上海南')).toBeInTheDocument()
    })
  })

  it('should auto-select all stations initially if selectedFromStations is undefined', async () => {
    render(<TrainFilterBar {...defaultProps} />)
    
    await waitFor(() => {
      expect(mockOnFromStationsChange).toHaveBeenCalled()
    })
    
    // Check if called with all stations
    const calls = mockOnFromStationsChange.mock.calls
    const lastCall = calls[calls.length - 1][0]
    // Shanghai: ['上海虹桥', '上海南', '上海', '上海西', '金山北', '上海松江'] (6 items)
    expect(lastCall).toHaveLength(6)
    expect(lastCall).toEqual(expect.arrayContaining(['上海虹桥', '上海南', '上海']))
  })

  it('should toggle station selection when checkbox is clicked', async () => {
    // Provide initial selection
    const props = {
      ...defaultProps,
      selectedFromStations: ['上海虹桥', '上海南']
    }
    render(<TrainFilterBar {...props} />)

    await waitFor(() => expect(screen.getByLabelText('上海虹桥')).toBeChecked())
    
    // Click '上海虹桥' to deselect
    fireEvent.click(screen.getByLabelText('上海虹桥'))
    expect(mockOnFromStationsChange).toHaveBeenCalledWith(['上海南'])
    
    // Click '上海' to select
    fireEvent.click(screen.getByLabelText('上海'))
    expect(mockOnFromStationsChange).toHaveBeenCalledWith(['上海虹桥', '上海南', '上海'])
  })

  it('should select all stations when "All" button is clicked and not all are selected', async () => {
    const props = {
      ...defaultProps,
      selectedFromStations: ['上海虹桥']
    }
    render(<TrainFilterBar {...props} />)
    
    await waitFor(() => expect(screen.getByLabelText('上海虹桥')).toBeChecked())
    
    // Find "All" button for Departure Station
    // The component has multiple "All" buttons. Need to distinguish.
    // Structure: <div className="switch-row"><div className="row-label">出发车站</div><button>全部</button>...
    
    const rows = screen.getAllByText('出发车站')
    const row = rows[0].closest('.switch-row')
    const allBtn = within(row as HTMLElement).getByText('全部')
    
    fireEvent.click(allBtn)
    
    // Should select all 5 stations from the map
    const calls = mockOnFromStationsChange.mock.calls
    const lastCall = calls[calls.length - 1][0]
    expect(lastCall.length).toBeGreaterThan(4)
    expect(lastCall).toContain('上海')
  })

  it('should deselect all stations when "All" button is clicked and currently all are selected', async () => {
    // Simulate all selected
    const allStations = ['上海虹桥', '上海南', '上海', '上海西', '金山北', '上海松江']
    const props = {
      ...defaultProps,
      selectedFromStations: allStations
    }
    render(<TrainFilterBar {...props} />)
    
    await waitFor(() => expect(screen.getByLabelText('上海虹桥')).toBeChecked())
    
    const rows = screen.getAllByText('出发车站')
    const row = rows[0].closest('.switch-row')
    const allBtn = within(row as HTMLElement).getByText('全部')
    
    fireEvent.click(allBtn)
    
    expect(mockOnFromStationsChange).toHaveBeenCalledWith([])
  })

  it('should handle city with single station', async () => {
    // Override mock for this test
    (stationApi.getStations as any).mockResolvedValue([{ name: 'SmallCityStation' }])
    
    const props = {
      ...defaultProps,
      fromStation: 'SmallCity',
      selectedFromStations: undefined
    }
    
    // We need to bypass the hardcoded map in component.
    // SmallCity is not in map.
    
    render(<TrainFilterBar {...props} />)
    
    await waitFor(() => expect(screen.getByLabelText('SmallCityStation')).toBeInTheDocument())
    
    // Auto-select should trigger
    expect(mockOnFromStationsChange).toHaveBeenCalled()
    const calls = mockOnFromStationsChange.mock.calls
    const lastCall = calls[calls.length - 1][0]
    expect(lastCall).toEqual(['SmallCityStation'])
  })
})
