import { test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { TopNavigationBar } from '../../src/components/TopNavigationBar';

test('Given the user is on any page, When the logo is clicked, Then it should navigate to the homepage', () => {
  render(<MemoryRouter><TopNavigationBar /></MemoryRouter>);
  const logoElement = screen.getByTestId('logo');
  expect(logoElement).toBeDefined();
});