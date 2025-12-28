import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PassengerForm from '../../src/components/PassengerForm';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

describe('PassengerForm Component', () => {
  test('5.1.10.1 & 5.1.10.6: Add mode - Validation messages for empty fields', () => {
    const handleSubmit = vi.fn();
    render(<PassengerForm onSubmit={handleSubmit} onCancel={() => {}} />);

    // Click submit without filling anything
    fireEvent.click(screen.getByText('保存'));

    // Check validation messages
    expect(screen.getByText('请输入您的姓名！')).toBeInTheDocument();
    expect(screen.getByText('请输入证件号码！')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test('5.1.10.5: Add mode - Validation message for invalid ID', () => {
    const handleSubmit = vi.fn();
    render(<PassengerForm onSubmit={handleSubmit} onCancel={() => {}} />);

    const idTypeSelect = screen.getByLabelText(/证件类型/);
    fireEvent.change(idTypeSelect, { target: { value: '居民身份证' } });

    const idInput = screen.getByLabelText(/证件号码/);
    fireEvent.change(idInput, { target: { value: '123' } }); // Invalid ID
    fireEvent.blur(idInput); // Trigger blur validation or submit

    // Click submit
    fireEvent.click(screen.getByText('保存'));

    expect(screen.getByText('请正确输入18位的证件号码！')).toBeInTheDocument();
  });

  test('5.1.9: Edit mode - Read only fields and Layout', () => {
    const passenger = {
      passengerId: 'p1',
      name: '张三',
      idType: '居民身份证',
      idNumber: '110101199001011234',
      phone: '13800138000',
      discountType: '成人',
      verificationStatus: '已通过'
    };

    render(<PassengerForm passenger={passenger} onSubmit={() => {}} onCancel={() => {}} />);

    // Check title change
    expect(screen.getByText('修改乘车人')).toBeInTheDocument();

    // Check read-only display (text instead of input for name/id)
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('请输入姓名')).not.toBeInTheDocument();

    expect(screen.getByText('110101199001011234')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('请填写证件号码')).not.toBeInTheDocument();

    // Check "Contact Info" section subtitle
    expect(screen.getByText('（请提供乘车人真实有效的联系方式）')).toBeInTheDocument();

    // Check phone input exists (editable)
    const phoneInput = screen.getByLabelText('手机号：') as HTMLInputElement;
    expect(phoneInput).toHaveValue('138****8000');

    fireEvent.focus(phoneInput);
    expect(phoneInput).toHaveValue('13800138000');

    fireEvent.blur(phoneInput);
    expect(phoneInput).toHaveValue('138****8000');
  });
});
