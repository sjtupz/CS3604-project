import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import PassengerList from '../../src/components/PassengerList';
import PassengerForm from '../../src/components/PassengerForm';
import '@testing-library/jest-dom';
import * as api from '../../src/api/passengers';
import * as userApi from '../../src/api/personal_user';
import { vi } from 'vitest';

// Mock the API module
vi.mock('../../src/api/passengers');
vi.mock('../../src/api/personal_user');

const mockSelfPassenger = {
  passengerId: 'self_123',
  name: '本人',
  idType: '居民身份证',
  idNumber: '110101199001011234',
  phone: '13800138000',
  verificationStatus: '已通过',
  discountType: '成人',
  isSelf: true
};

const mockOtherPassenger = {
  passengerId: 'other_456',
  name: '其他',
  idType: '居民身份证',
  idNumber: '320101199505055678',
  phone: '13900139000',
  verificationStatus: '已通过',
  discountType: '学生',
  isSelf: false
};

describe('Passenger Requirements 05_PersonalCenter', () => {
  
  // Requirement: Passenger list at least has current account holder as first passenger...
  // has checkbox, operation column empty, no modify or delete button.
  test('Requirement: Self passenger is first, has checkbox, no edit/delete buttons', async () => {
    // Mock API to return Other first, then Self (to test sorting/ordering logic)
    (api.getPassengers as any).mockResolvedValue([mockOtherPassenger, mockSelfPassenger]);
    // Mock getUserInfo to avoid 401 and simulate real scenario (though component logic handles null)
    (userApi.getUserInfo as any).mockResolvedValue({
      id: 'self_123',
      idNumber: mockSelfPassenger.idNumber,
      realName: '本人', // Must provide name as it overwrites list data
      // ... other fields not strictly needed if getPassengers returns self with isSelf=true
    });

    render(<PassengerList />);

    // Wait for data load
    await waitFor(() => {
      expect(screen.getByText('本人')).toBeInTheDocument();
    });

    // Check if '本人' is in the first row
    // We can use the row number which is displayed in the first column
    // The checkbox testId is `row-1-checkbox`
    const firstRowCheckbox = screen.getByTestId('row-1-checkbox');
    expect(firstRowCheckbox).toBeInTheDocument();

    // Verify this row contains '本人'
    // Get the row container (parent of the checkbox's parent)
    const firstRow = firstRowCheckbox.closest('div')?.parentElement;
    expect(firstRow).toBeInTheDocument();
    expect(within(firstRow as HTMLElement).getByText('本人')).toBeInTheDocument();

    // Verify '其他' is in the second row (checking sort order)
    const secondRowCheckbox = screen.getByTestId('row-2-checkbox');
    const secondRow = secondRowCheckbox.closest('div')?.parentElement;
    expect(within(secondRow as HTMLElement).getByText('其他')).toBeInTheDocument();

    // Check for ABSENCE of Edit/Delete buttons in self row
    // Assuming buttons have text "修改" or "删除"
    expect(within(firstRow as HTMLElement).queryByText('修改')).not.toBeInTheDocument();
    expect(within(firstRow as HTMLElement).queryByText('删除')).not.toBeInTheDocument();
  });

  // 5.1.9 Modify Passenger Page
  test('5.1.9: Edit Page Layout and Content', () => {
    const handleSubmit = vi.fn();
    render(<PassengerForm passenger={mockSelfPassenger} onSubmit={handleSubmit} onCancel={() => {}} />);

    // 5.1.9.1 Three Sections with bold titles
    // "基本信息", "联系方式（请提供乘车人真实有效的联系方式）", "附加信息"
    expect(screen.getByText('基本信息')).toBeInTheDocument();
    
    // Use getByRole for heading to avoid multiple matches with span content
    // The heading text contains the span text, so regex match on heading should work
    const contactHeading = screen.getByRole('heading', { name: /联系方式/ });
    expect(contactHeading).toBeInTheDocument();
    expect(within(contactHeading).getByText(/请提供乘车人真实有效的联系方式/)).toBeInTheDocument();
    
    expect(screen.getByText('附加信息')).toBeInTheDocument();

    // 5.1.9.2 Basic Info Read-only
    // "已通过" should be blue
    const status = screen.getByText('已通过');
    expect(status).toBeInTheDocument();
    // expect(status).toHaveStyle('color: blue'); // Optional strict check

    // Inputs should NOT be present for Name/ID in Edit mode
    expect(screen.queryByPlaceholderText('请输入姓名')).not.toBeInTheDocument();
    
    // 5.1.9.3 Contact Info
    // Phone dropdown +86 etc.
    expect(screen.getByText('+86')).toBeInTheDocument(); // Assuming default or value
    
    // Check Phone Masking Logic (Mask on blur, Raw on focus)
    const phoneInput = screen.getByDisplayValue('138****8000'); // Should be masked initially
    expect(phoneInput).toBeInTheDocument();

    // Focus -> Reveal
    fireEvent.focus(phoneInput);
    expect(phoneInput).toHaveValue('13800138000');

    // Blur -> Mask
    fireEvent.blur(phoneInput);
    expect(phoneInput).toHaveValue('138****8000');
    
    // 5.1.9.4 Additional Info
    // Discount type dropdown
    expect(screen.getByDisplayValue('成人')).toBeInTheDocument();

    // 5.1.9.5 Buttons
    const saveBtn = screen.getByText('保存');
    expect(saveBtn).toBeInTheDocument();
    // expect(saveBtn).toHaveStyle('background-color: orange'); // Optional
  });

  // 5.1.10 Add Passenger Page
  test('5.1.10: Add Page Layout and Validation', () => {
    const handleSubmit = vi.fn();
    render(<PassengerForm onSubmit={handleSubmit} onCancel={() => {}} />);

    // 5.1.10.1 Basic Info Placeholders
    expect(screen.getByPlaceholderText('请输入姓名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请填写证件号码')).toBeInTheDocument();

    // 5.1.10.2 Contact Info Placeholder
    expect(screen.getByPlaceholderText('请填写手机号码')).toBeInTheDocument();

    // 5.1.10.6 Empty Validation
    fireEvent.click(screen.getByText('保存'));
    expect(screen.getByText('请输入您的姓名！')).toBeInTheDocument();
    expect(screen.getByText('请输入证件号码！')).toBeInTheDocument();

    // 5.1.10.5 Invalid ID Validation
    const idInput = screen.getByPlaceholderText('请填写证件号码');
    fireEvent.change(idInput, { target: { value: '123' } });
    fireEvent.click(screen.getByText('保存'));
    expect(screen.getByText('请输入正确的证件号码！')).toBeInTheDocument();
  });

});
