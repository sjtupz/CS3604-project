import { test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../../src/pages/HomePage';

// Mock the components that are being used in HomePage
vi.mock('../../src/components/TicketQueryForm', () => ({ TicketQueryForm: () => <div>TicketQueryForm</div> }));

test('Given the HomePage is rendered, Then it should display the main components', () => {
  render(<HomePage />);
  
  expect(screen.getByText('TicketQueryForm')).toBeInTheDocument();
});

test('Given the HomePage is rendered, Then it should display the main visual image', () => {
  render(<HomePage />);
  
  const img = screen.getByAltText('首页视觉展示');
  expect(img).toBeInTheDocument();
  // We can't strictly check the src path because Vite/Vitest transforms it, 
  // but we can check existence and alt text which confirms it's our image tag.
});