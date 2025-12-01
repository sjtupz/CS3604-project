import { render } from '@testing-library/react';
import { test, expect } from 'vitest';
import { PasswordStrength } from '../../src/components/PasswordStrength';

test('Given no password When PasswordStrength is rendered Then only left red bar is lit', () => {
  const { container } = render(<PasswordStrength strength="none" />);
  const bars = container.querySelectorAll('.strength-bar');
  expect(bars.length).toBe(3);
  expect(bars[0].classList.contains('red')).toBe(true);
  expect(bars[1].classList.contains('orange')).toBe(false);
  expect(bars[2].classList.contains('green')).toBe(false);
});

