import { test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../../src/pages/HomePage';

// Mock the components that are being used in HomePage
vi.mock('../../src/components/TopNavigationBar', () => ({ TopNavigationBar: () => <div>TopNavigationBar</div> }));
vi.mock('../../src/components/QuickAccessMenu', () => ({ QuickAccessMenu: () => <div>QuickAccessMenu</div> }));
vi.mock('../../src/components/TicketQueryForm', () => ({ TicketQueryForm: () => <div>TicketQueryForm</div> }));

test('Given the HomePage is rendered, Then it should display the main components', () => {
  render(<HomePage />);
  
  expect(screen.getByText('TopNavigationBar')).toBeInTheDocument();
  expect(screen.getByText('QuickAccessMenu')).toBeInTheDocument();
  expect(screen.getByText('TicketQueryForm')).toBeInTheDocument();
});