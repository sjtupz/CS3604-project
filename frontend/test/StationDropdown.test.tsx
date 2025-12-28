import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StationDropdown } from '../src/components/StationDropdown'

describe('StationDropdown', () => {
  it('supports typing and selecting station with pinyin search', async () => {
    const onSelect = vi.fn()
    const onInputChange = vi.fn()
    render(<StationDropdown id="fromStation" value="" onSelectStation={onSelect} onInputChange={onInputChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Bei' } })

    await waitFor(() => {
      expect(screen.queryByText(/北京南/)).toBeTruthy()
    })

    const option = screen.getByText(/北京南/)
    fireEvent.mouseDown(option)

    expect(onSelect).toHaveBeenCalledWith('北京南')
    expect(onInputChange).toHaveBeenCalledWith('北京南')
  })
})

