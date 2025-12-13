import { render, screen, fireEvent, act } from '@testing-library/react'
import { TrainListPage } from '../../src/pages/TrainListPage'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Mock components
vi.mock('../../src/components/DatePicker', () => ({
  DatePicker: () => <div data-testid="date-picker">DatePicker</div>
}))

vi.mock('../../src/components/StationDropdown', () => ({
  StationDropdown: ({ id, value, onSelectStation }: any) => (
    <input 
      data-testid={id} 
      value={value} 
      onChange={(e) => onSelectStation(e.target.value)} 
    />
  )
}))

vi.mock('../../src/components/TrainFilterBar', () => ({
  TrainFilterBar: () => <div data-testid="train-filter-bar">FilterBar</div>
}))
vi.mock('../../src/components/TrainList', () => ({
  TrainList: () => <div data-testid="train-list">TrainList</div>
}))

describe('TrainListPage Swap Functionality', () => {
  test('Given rendered page, When checking for swap button, Then it should exist with correct label', () => {
    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )
    
    const swapBtn = screen.getByRole('button', { name: '交换出发地和目的地' })
    expect(swapBtn).toBeInTheDocument()
    expect(swapBtn).toHaveTextContent('↔')
  })

  test('Given different from/to stations, When swap button clicked, Then values should be swapped', () => {
    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )
    
    const fromInput = screen.getByTestId('fromStation')
    const toInput = screen.getByTestId('toStation')
    const swapBtn = screen.getByRole('button', { name: '交换出发地和目的地' })

    // Set initial values
    fireEvent.change(fromInput, { target: { value: 'Beijing' } })
    fireEvent.change(toInput, { target: { value: 'Shanghai' } })

    expect(fromInput).toHaveValue('Beijing')
    expect(toInput).toHaveValue('Shanghai')

    // Click swap
    fireEvent.click(swapBtn)

    // Check values swapped
    expect(fromInput).toHaveValue('Shanghai')
    expect(toInput).toHaveValue('Beijing')
  })

  test('Given swap in progress, When checking button class, Then it should have swapping class', () => {
    vi.useFakeTimers()
    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )
    
    const swapBtn = screen.getByRole('button', { name: '交换出发地和目的地' })
    
    fireEvent.click(swapBtn)
    
    expect(swapBtn).toHaveClass('swapping')
    
    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(swapBtn).not.toHaveClass('swapping')
    vi.useRealTimers()
  })

  test('Given isSwapping is true, When clicking button again, Then logic should not run (prevent double click)', () => {
     vi.useFakeTimers()
    render(
      <MemoryRouter>
        <TrainListPage />
      </MemoryRouter>
    )
    
    const fromInput = screen.getByTestId('fromStation')
    const toInput = screen.getByTestId('toStation')
    const swapBtn = screen.getByRole('button', { name: '交换出发地和目的地' })

    fireEvent.change(fromInput, { target: { value: 'A' } })
    fireEvent.change(toInput, { target: { value: 'B' } })

    // First click
    fireEvent.click(swapBtn)
    expect(fromInput).toHaveValue('B')
    expect(toInput).toHaveValue('A')
    
    // Immediately try to change values back manually to simulate race or verify disabled state logic
    // But button is disabled in UI? Let's check if we disabled it.
    // Code says: disabled={isSwapping}
    
    expect(swapBtn).toBeDisabled()
    
    // Try clicking disabled button (should not trigger click handler ideally, or handler checks isSwapping)
    fireEvent.click(swapBtn)
    
    // Should still be B and A (no double swap)
    expect(fromInput).toHaveValue('B')
    expect(toInput).toHaveValue('A')

    vi.useRealTimers()
  })
})
