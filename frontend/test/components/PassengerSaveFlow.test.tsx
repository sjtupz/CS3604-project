import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PersonalCenterLayout from '../../src/components/PersonalCenterLayout';
import '@testing-library/jest-dom';
import * as passengerApi from '../../src/api/passengers';
import * as userApi from '../../src/api/personal_user';
import { vi } from 'vitest';

// Mock API modules
vi.mock('../../src/api/passengers');
vi.mock('../../src/api/personal_user');

const mockInitialPassengers = [
  {
    passengerId: 'self_123',
    name: '本人',
    idType: '居民身份证',
    idNumber: '110101199001011234',
    phone: '13800138000',
    verificationStatus: '已通过',
    discountType: '成人',
    isSelf: true
  }
];

describe('Passenger Save Flow Integration Test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Complete passenger save flow: add new passenger and display in list', async () => {
    // Mock initial empty passenger list
    (passengerApi.getPassengers as any).mockResolvedValueOnce(mockInitialPassengers);
    (userApi.getUserInfo as any).mockResolvedValue({});
    
    // Mock successful passenger creation
    const newPassengerData = {
      passengerId: 'new_passenger_789',
      name: '张三',
      idType: '居民身份证',
      idNumber: '320101199505055678',
      phone: '13900139000',
      verificationStatus: '已通过',
      discountType: '成人'
    };
    
    (passengerApi.createPassenger as any).mockResolvedValueOnce(newPassengerData);
    
    // Mock updated passenger list after creation
    (passengerApi.getPassengers as any).mockResolvedValueOnce([
      ...mockInitialPassengers,
      newPassengerData
    ]);
    
    // Mock getPassengers for refresh callback
    (passengerApi.getPassengers as any).mockResolvedValueOnce([
      ...mockInitialPassengers,
      newPassengerData
    ]);

    render(<PersonalCenterLayout activeSection="乘车人" />);

    // 1. Verify initial passenger list is displayed
    await waitFor(() => {
      expect(screen.getByText('本人')).toBeInTheDocument();
    });

    // 2. Click Add button to open form
    const addBtn = screen.getByText('+ 添加');
    fireEvent.click(addBtn);

    // 3. Verify form is displayed
    await waitFor(() => {
      expect(screen.getByText('添加乘车人')).toBeInTheDocument();
    });

    // 4. Fill in passenger information
    const nameInput = screen.getByPlaceholderText('请输入姓名');
    const idInput = screen.getByPlaceholderText('请填写证件号码');
    const phoneInput = screen.getByPlaceholderText('请填写手机号码');

    fireEvent.change(nameInput, { target: { value: '张三' } });
    fireEvent.change(idInput, { target: { value: '320101199505055678' } });
    fireEvent.change(phoneInput, { target: { value: '13900139000' } });

    // 5. Click Save button
    const saveBtn = screen.getByText('保存');
    fireEvent.click(saveBtn);

    // 6. Verify API calls were made correctly
    await waitFor(() => {
      expect(passengerApi.createPassenger).toHaveBeenCalledWith({
        name: '张三',
        idType: '居民身份证',
        idNumber: '320101199505055678',
        phone: '13900139000',
        discountType: '',
        birthDate: undefined,
        expiryDate: undefined,
        passengerId: undefined
      });
    });

    // 7. Verify we're back to the list view
    await waitFor(() => {
      expect(screen.getByText('+ 添加')).toBeInTheDocument();
    });

    // 8. Verify new passenger appears in the list
    await waitFor(() => {
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('3201**********5678')).toBeInTheDocument(); // Masked ID format
    });

    // 9. Verify the passenger list now has 2 passengers
    expect(screen.getByTestId('row-1-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('row-2-checkbox')).toBeInTheDocument();
    expect(screen.queryByTestId('row-3-checkbox')).toBeNull();
  });

  test('Passenger list displays all passengers in rows', async () => {
    const multiplePassengers = [
      ...mockInitialPassengers,
      {
        passengerId: 'passenger_1',
        name: '李四',
        idType: '居民身份证',
        idNumber: '330101198808083333',
        phone: '13700137000',
        verificationStatus: '已通过',
        discountType: '学生'
      },
      {
        passengerId: 'passenger_2',
        name: '王五',
        idType: '居民身份证',
        idNumber: '340101197707074444',
        phone: '13600136000',
        verificationStatus: '已通过',
        discountType: '成人'
      }
    ];

    (passengerApi.getPassengers as any).mockResolvedValue(multiplePassengers);
    (userApi.getUserInfo as any).mockResolvedValue({});

    render(<PersonalCenterLayout activeSection="乘车人" />);

    // Verify all passengers are displayed
    await waitFor(() => {
      expect(screen.getByText('本人')).toBeInTheDocument();
      expect(screen.getByText('李四')).toBeInTheDocument();
      expect(screen.getByText('王五')).toBeInTheDocument();
    });

    // Verify each passenger has their details displayed (accounting for masking)
    expect(screen.getByText('1101**********1234')).toBeInTheDocument(); // 本人证件号 (masked)
    expect(screen.getByText('3301**********3333')).toBeInTheDocument(); // 李四证件号 (masked)
    expect(screen.getByText('3401**********4444')).toBeInTheDocument(); // 王五证件号 (masked)
  });

  test('Edit passenger and save changes', async () => {
    const existingPassenger = {
      passengerId: 'passenger_123',
      name: '赵六',
      idType: '居民身份证',
      idNumber: '350101196606065555',
      phone: '13500135000',
      verificationStatus: '已通过',
      discountType: '成人'
    };

    (passengerApi.getPassengers as any).mockResolvedValueOnce([
      ...mockInitialPassengers,
      existingPassenger
    ]);
    (userApi.getUserInfo as any).mockResolvedValue({});
    
    // Mock getPassengerById for edit
    (passengerApi.getPassengerById as any).mockResolvedValueOnce(existingPassenger);
    
    // Mock successful update
    (passengerApi.updatePassenger as any).mockResolvedValueOnce({
      ...existingPassenger,
      phone: '13500135999'
    });
    
    // Mock updated passenger list
    (passengerApi.getPassengers as any).mockResolvedValueOnce([
      ...mockInitialPassengers,
      {
        ...existingPassenger,
        phone: '13500135999'
      }
    ]);

    render(<PersonalCenterLayout activeSection="乘车人" />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('赵六')).toBeInTheDocument();
    });

    // Click edit button (assuming it's available for non-self passengers)
    const editBtn = screen.getByText('修改');
    fireEvent.click(editBtn);

    // Verify edit form is displayed
    await waitFor(() => {
      expect(screen.getByText('修改乘车人')).toBeInTheDocument();
    });

    // Change phone number
    const phoneInput = screen.getByDisplayValue('135****5000'); // Assuming masked format
    fireEvent.focus(phoneInput); // Unmask
    fireEvent.change(phoneInput, { target: { value: '13500135999' } });

    // Save changes
    const saveBtn = screen.getByText('保存');
    fireEvent.click(saveBtn);

    // Verify update API was called
    await waitFor(() => {
      expect(passengerApi.updatePassenger).toHaveBeenCalledWith('passenger_123', expect.objectContaining({
        phone: '13500135999'
      }));
    });

    // Verify we're back to list and changes are reflected
    await waitFor(() => {
      expect(screen.getByText('+ 添加')).toBeInTheDocument();
      expect(screen.getByText('135****5999')).toBeInTheDocument(); // Phone number should be masked
    });
  });
});
