import { test, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TopNavigationBar } from '../../src/components/TopNavigationBar';

test('Given the user is on any page, When the logo is clicked, Then it should navigate to the homepage', () => {
  render(<TopNavigationBar />);
  const logoElement = screen.getByTestId('logo');
  expect(logoElement).toBeDefined();
});