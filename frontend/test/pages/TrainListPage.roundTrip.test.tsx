import { render, screen, fireEvent } from '@testing-library/react'
import { TrainListPage } from '../../src/pages/TrainListPage'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Mock DatePicker since it might use internal state that's hard to control
vi.mock('../../src/components/DatePicker', () => ({
  DatePicker: ({ id, minDate, value, onDateSelect }: any) => (
    <input 
      data-testid={id} 
      type="date" 
      min={minDate} 
      value={value} 
      onChange={(e) => onDateSelect(e.target.value)} 
    />
  )
}))

// Mock StationDropdown to avoid complexity
vi.mock('../../src/components/StationDropdown', () => ({
  StationDropdown: ({ id, value, onSelectStation }: any) => (
    <input 
      data-testid={id} 
      value={value} 
      onChange={(e) => onSelectStation(e.target.value)} 
    />
  )
}))

// Mock TrainFilterBar and TrainList to avoid rendering errors
vi.mock('../../src/components/TrainFilterBar', () => ({
  TrainFilterBar: () => <div data-testid="train-filter-bar">FilterBar</div>
}))
vi.mock('../../src/components/TrainList', () => ({
  TrainList: () => <div data-testid="train-list">TrainList</div>
}))

describe('TrainListPage Round Trip Functionality', () => {
  test('Given default state, When rendered, Then Return Date picker is hidden', () => {
    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )
    
    // Check Round Trip radio exists
    const roundTripRadio = screen.getByLabelText('往返')
    expect(roundTripRadio).toBeInTheDocument()
    expect(roundTripRadio).not.toBeChecked()

    // Check Return Date picker is NOT present
    const returnDatePicker = screen.queryByTestId('returnDate')
    expect(returnDatePicker).not.toBeInTheDocument()
  })

  test('Given user selects Round Trip, When clicked, Then Return Date picker appears', () => {
    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )
    
    const roundTripRadio = screen.getByLabelText('往返')
    fireEvent.click(roundTripRadio)

    // Check Return Date picker IS present
    const returnDatePicker = screen.getByTestId('returnDate')
    expect(returnDatePicker).toBeInTheDocument()
  })

  test('Given Round Trip selected, When Departure Date changes, Then Return Date min attribute updates', () => {
    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )
    
    // Select Round Trip
    fireEvent.click(screen.getByLabelText('往返'))
    
    // Change Departure Date
    const departDateInput = screen.getByTestId('departDate')
    fireEvent.change(departDateInput, { target: { value: '2025-12-25' } })
    
    // Check Return Date min attribute
    const returnDatePicker = screen.getByTestId('returnDate')
    expect(returnDatePicker).toHaveAttribute('min', '2025-12-25')
  })

  test('Given Round Trip selected, When Departure Date is set after Return Date, Then Return Date updates to match', () => {
    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )
    
    // Select Round Trip
    fireEvent.click(screen.getByLabelText('往返'))
    
    const departDateInput = screen.getByTestId('departDate')
    const returnDatePicker = screen.getByTestId('returnDate')
    
    // Set initial dates
    // Assuming default is today. Let's set departure to 2025-01-01
    fireEvent.change(departDateInput, { target: { value: '2025-01-01' } })
    // Set return to 2025-01-05
    fireEvent.change(returnDatePicker, { target: { value: '2025-01-05' } })
    
    expect(returnDatePicker).toHaveValue('2025-01-05')
    
    // Now change departure to 2025-01-10 (after return date)
    fireEvent.change(departDateInput, { target: { value: '2025-01-10' } })
    
    // Return Date should automatically update to 2025-01-10
    expect(returnDatePicker).toHaveValue('2025-01-10')
  })
})
