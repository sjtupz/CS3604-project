import { test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from '../../src/components/DatePicker';

test('Given the DatePicker is rendered, When a date is selected, Then the onDateSelect callback should be called', () => {
  const onDateSelect = vi.fn();
  render(<DatePicker onDateSelect={onDateSelect} />);

    const dateInput = screen.getByTestId('date-picker-input');
  const testDate = '2025-12-25';

  fireEvent.change(dateInput, { target: { value: testDate } });

  expect(onDateSelect).toHaveBeenCalledWith(testDate);
});