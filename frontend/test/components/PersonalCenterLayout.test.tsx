import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PersonalCenterLayout from '../../src/components/PersonalCenterLayout';
import '@testing-library/jest-dom';
import * as passengerApi from '../../src/api/passengers';
import * as userApi from '../../src/api/personal_user'; // PassengerList also calls getUserInfo
import { vi } from 'vitest';

// Mock API modules
vi.mock('../../src/api/passengers');
vi.mock('../../src/api/personal_user');

describe('PersonalCenterLayout Passenger Integration', () => {
  test('Clicking Add button switches to PassengerForm', async () => {
    // Mock API responses
    (passengerApi.getPassengers as any).mockResolvedValue([]);
    (userApi.getUserInfo as any).mockResolvedValue({}); // Mock user info for PassengerList
    
    render(<PersonalCenterLayout activeSection="乘车人" />);

    // 1. Verify List is shown initially
    // "Add" button should be visible
    const addBtn = await screen.findByText('+ 添加');
    expect(addBtn).toBeInTheDocument();

    // 2. Click Add -> Switch to Form
    fireEvent.click(addBtn);

    // Verify Form is shown
    // PassengerForm renders <h2>添加乘车人</h2> when adding
    const formTitle = await screen.findByText('添加乘车人');
    expect(formTitle).toBeInTheDocument();
    
    // Verify List (Add button) is GONE
    expect(screen.queryByText('+ 添加')).not.toBeInTheDocument();
    
    // 3. Click Cancel -> Switch back to List
    const cancelBtn = screen.getByText('取消');
    fireEvent.click(cancelBtn);
    
    // Verify List is back
    expect(await screen.findByText('+ 添加')).toBeInTheDocument();
  });
});
