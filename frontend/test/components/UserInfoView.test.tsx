import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserInfoView from '../../src/components/UserInfoView';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('UserInfoView', () => {
  const mockUserInfo = {
    username: 'testuser',
    realName: 'Test User',
    country: 'China',
    idType: 'ID Card',
    idNumber: '110101199001011234',
    verificationStatus: 'Verified',
    phoneNumber: '13800138000',
    email: 'test@example.com',
    phoneVerified: true,
    discountType: '成人',
  };

  const mockOnUpdateDiscountType = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: vi.fn() },
    });
  });

  test('renders user info correctly', () => {
    render(<UserInfoView userInfo={mockUserInfo} />);
    expect(screen.getByText('优惠(待)类型: 成人')).toBeInTheDocument();
    // There are two "编辑" buttons (Contact and Discount), so get the one in the Discount section or check all
    // The structure is:
    // Basic Info
    // Contact Info -> Edit
    // Discount Type -> Edit
    // We can look for the button near "优惠类型"
    const buttons = screen.getAllByText('编辑');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('enters edit mode and saves successfully', async () => {
    mockOnUpdateDiscountType.mockResolvedValue(true);
    render(<UserInfoView userInfo={mockUserInfo} onUpdateDiscountType={mockOnUpdateDiscountType} />);

    // Find the Edit button for Discount Type. 
    // It's the second one based on the component structure, but better to find by nearby text.
    // Or just click the one that toggles the discount type state.
    // Let's assume we click the second '编辑'
    const editButtons = screen.getAllByText('编辑');
    fireEvent.click(editButtons[1]); 
    
    // Check if dropdown appears
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    // Check if label exists in edit mode
    expect(screen.getAllByText('优惠(待)类型:').length).toBeGreaterThan(0);
    
    // The button text should change to '保存'
    // Note: The inner save button was removed, so only the top-right button remains and changes text.
    expect(screen.getByText('保存')).toBeInTheDocument();

    // Click Save
    fireEvent.click(screen.getByText('保存'));

    // Check if API called
    expect(mockOnUpdateDiscountType).toHaveBeenCalledWith('成人', undefined);

    // Check if Modal appears
    await waitFor(() => {
      expect(screen.getByText('保存成功')).toBeInTheDocument();
    });

    // Click Confirm
    fireEvent.click(screen.getByText('确定'));

    // Check reload NOT called (commented out in code)
    expect(window.location.reload).not.toHaveBeenCalled();
  });
});
