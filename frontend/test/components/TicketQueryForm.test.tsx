import { test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TicketQueryForm } from '../../src/components/TicketQueryForm';

// Mock child components
vi.mock('../../src/components/StationDropdown', () => ({
  StationDropdown: ({ onSelectStation, value }) => (
    <input
      data-testid="station-input"
      value={value || ''} // Controlled by the parent's state
      onChange={(e) => onSelectStation(e.target.value)} // Notify parent of change
    />
  ),
}));
vi.mock('../../src/components/DatePicker', () => ({
  DatePicker: ({ onDateSelect }) => <div data-testid="date-picker">DatePicker</div>,
}));

test('Given TicketQueryForm, when rendered, it should display two station inputs and a date picker', () => {
  render(<TicketQueryForm />);
  
  const stationInputs = screen.getAllByTestId('station-input');
  expect(stationInputs).toHaveLength(2);
  
  const datePicker = screen.getByTestId('date-picker');
  expect(datePicker).toBeInTheDocument();
});

test('Given date is empty, when query button is clicked, then it should show date error message', async () => {
  const user = userEvent.setup();
  render(<TicketQueryForm />);

  const stationInputs = screen.getAllByTestId('station-input');
  const fromInput = stationInputs[0];
  const toInput = stationInputs[1];
  await user.type(fromInput, 'Beijing');
  await user.type(toInput, 'Shanghai');

  const queryButton = screen.getByRole('button', { name: '查询' });
  await user.click(queryButton);

  const errorMessage = await screen.findByText('❗请输入出发日期');
  expect(errorMessage).toBeInTheDocument();
});

test('Given from and to stations are filled, when swap button is clicked, then their values should be swapped', async () => {
  const user = userEvent.setup();
  render(<TicketQueryForm />);

  const stationInputs = screen.getAllByTestId('station-input');
  const fromInput = stationInputs[0];
  const toInput = stationInputs[1];

  await user.type(fromInput, 'Beijing');
  await user.type(toInput, 'Shanghai');

  expect(fromInput.value).toBe('Beijing');
  expect(toInput.value).toBe('Shanghai');

  const swapButton = screen.getByTitle('交换出发地和目的地');
  await user.click(swapButton);

  expect(fromInput.value).toBe('Shanghai');
  expect(toInput.value).toBe('Beijing');
});