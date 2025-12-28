import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TrainFilterBar } from '../../src/components/TrainFilterBar'
import { vi } from 'vitest'
import * as stationApi from '../../src/api/station'

// Mock getStations
vi.mock('../../src/api/station', () => ({
  getStations: vi.fn()
}))

describe('TrainFilterBar Station "All" Selection', () => {
  const defaultProps = {
    selectedDate: '2023-01-01',
    timeRange: '',
    onDateChange: vi.fn(),
    onTimeRangeChange: vi.fn(),
    fromStation: 'TestCity',
    toStation: 'DestCity',
    onFromStationsChange: vi.fn(),
    onToStationsChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('selects all stations (including city name) when "All" is clicked', async () => {
    const user = userEvent.setup()
    
    // Mock return value for getStations
    const mockStations = [
      { name: 'TestCity', code: 'TC', pinyin: 'testcity', city: 'TestCity' },
      { name: 'TestCity South', code: 'TCS', pinyin: 'testcitysouth', city: 'TestCity' },
      { name: 'TestCity North', code: 'TCN', pinyin: 'testcitynorth', city: 'TestCity' }
    ]
    vi.mocked(stationApi.getStations).mockResolvedValue(mockStations)

    // 1. Initial Render (All Selected by default)
    const { rerender } = render(<TrainFilterBar {...defaultProps} selectedFromStations={undefined} />)

    // Wait for stations to load
    await waitFor(() => {
      const stations = screen.getAllByText('TestCity South')
      expect(stations.length).toBeGreaterThan(0)
    })

    // Verify initial state: "All" button is active
    const allButtons = screen.getAllByText('全部')
    const fromAllButton = allButtons[1] // 0: TrainType, 1: Departure, 2: Arrival, 3: SeatType
    expect(fromAllButton).toHaveClass('active')

    // Verify all checkboxes are checked
    // We need to find the ones for stations in the "Departure Station" section
    // Use closest to find the container
    const departureRow = fromAllButton.closest('.switch-row')
    expect(departureRow).not.toBeNull()
    
    // Within this row, check inputs
    // Note: testing-library doesn't support scoping easily without 'within'
    // But we can check by label text if unique, but they are not unique here.
    // So let's rely on the fact they are checked.
    // Or we can use `within(departureRow)`
    const { getByLabelText } = within(departureRow!)
    expect(getByLabelText('TestCity')).toBeChecked()
    expect(getByLabelText('TestCity South')).toBeChecked()

    // 2. Click "All" -> Should Deselect All (because it was active)
    await user.click(fromAllButton)
    expect(defaultProps.onFromStationsChange).toHaveBeenCalledWith([])

    // 3. Re-render with Deselected State
    rerender(<TrainFilterBar {...defaultProps} selectedFromStations={[]} />)
    
    // Verify "All" button is NOT active
    expect(fromAllButton).not.toHaveClass('active')
    
    // Verify checkboxes are unchecked
    // Need to find them again as DOM might have updated
    const departureRow2 = fromAllButton.closest('.switch-row')
    const { getByLabelText: getByLabelText2 } = within(departureRow2!)
    const cityCheckbox2 = getByLabelText2('TestCity')
    const southCheckbox2 = getByLabelText2('TestCity South')
    
    expect(cityCheckbox2).not.toBeChecked()
    expect(southCheckbox2).not.toBeChecked()

    // 4. Click "All" again -> Should Select All (including City Name)
    await user.click(fromAllButton)
    
    // Verify callback called with ALL stations
    // The order might vary, but should contain all names from mockStations
    expect(defaultProps.onFromStationsChange).toHaveBeenCalledWith(
      expect.arrayContaining(['TestCity', 'TestCity South', 'TestCity North'])
    )
    // Ensure the array length is exactly 3
    const callArgs = vi.mocked(defaultProps.onFromStationsChange).mock.lastCall?.[0]
    expect(callArgs).toHaveLength(3)
  })

  it('cancels specific station when unchecked, and unhighlights "All"', async () => {
    const user = userEvent.setup()
    const mockStations = [
      { name: 'TestCity', code: 'TC', pinyin: 'testcity', city: 'TestCity' },
      { name: 'TestCity South', code: 'TCS', pinyin: 'testcitysouth', city: 'TestCity' }
    ]
    vi.mocked(stationApi.getStations).mockResolvedValue(mockStations)

    // Render with All Selected (undefined)
    render(<TrainFilterBar {...defaultProps} selectedFromStations={undefined} />)

    await waitFor(() => {
      const stations = screen.getAllByText('TestCity South')
      expect(stations.length).toBeGreaterThan(0)
    })

    // Uncheck "TestCity South"
    // Use getAllByLabelText and pick the first one (Departure)
    const southCheckboxes = screen.getAllByLabelText('TestCity South')
    const southCheckbox = southCheckboxes[0]
    await user.click(southCheckbox)

    // Should call callback with remaining stations (TestCity)
    // Note: logic is: if current is undefined, use depStations (All) -> remove clicked
    expect(defaultProps.onFromStationsChange).toHaveBeenCalledWith(['TestCity'])
  })
})
