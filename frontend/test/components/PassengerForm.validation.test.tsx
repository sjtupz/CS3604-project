import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PassengerForm from '../../src/components/PassengerForm';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

describe('PassengerForm Validation Requirements', () => {
  // Requirement: 当试图添加的乘车人信息的身份证号未在系统中注册过账号，则检查其是否符合身份证号的规则；
  // 若不符合，则在身份证号输入框下显示红字提示：请正确输入18位的证件号码！
  test('Shows "请正确输入18位的证件号码！" when ID format is invalid (local validation)', async () => {
    const handleSubmit = vi.fn();
    render(<PassengerForm onSubmit={handleSubmit} onCancel={() => {}} />);

    const idTypeSelect = screen.getByLabelText(/证件类型/);
    fireEvent.change(idTypeSelect, { target: { value: '居民身份证' } });

    const idInput = screen.getByLabelText(/证件号码/);
    fireEvent.change(idInput, { target: { value: '123' } }); // Invalid length
    fireEvent.blur(idInput);

    await waitFor(() => {
      expect(screen.getByText('请正确输入18位的证件号码！')).toBeInTheDocument();
    });

    // Try submit
    fireEvent.click(screen.getByText('保存'));
    await waitFor(() => {
      expect(screen.getByText('请正确输入18位的证件号码！')).toBeInTheDocument();
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  // Requirement: 当试图添加的乘车人信息的身份证号已经在系统中注册过账号，则检查与其对应的姓名是否一致，
  // 若不一致，在身份证号输入框下显示红字提示：身份信息不一致！
  test('Shows "身份信息不一致！" when server returns identity mismatch error', async () => {
    // Mock submit to throw specific error
    const handleSubmit = vi.fn().mockRejectedValue(new Error('身份信息不一致！'));
    render(<PassengerForm onSubmit={handleSubmit} onCancel={() => {}} />);

    const idTypeSelect = screen.getByLabelText(/证件类型/);
    fireEvent.change(idTypeSelect, { target: { value: '居民身份证' } });

    // Valid ID format to pass local validation
    const idInput = screen.getByLabelText(/证件号码/);
    fireEvent.change(idInput, { target: { value: '110101199001011234' } });
    
    const nameInput = screen.getByLabelText(/姓名/);
    fireEvent.change(nameInput, { target: { value: 'WrongName' } });

    // Submit
    fireEvent.click(screen.getByText('保存'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('身份信息不一致！')).toBeInTheDocument();
    });
  });

  // Extra check for "Passenger already exists" just in case
  test('Shows "该乘车人已存在" when server returns passenger exists error', async () => {
    const handleSubmit = vi.fn().mockRejectedValue(new Error('乘车人已存在'));
    render(<PassengerForm onSubmit={handleSubmit} onCancel={() => {}} />);

    const idTypeSelect = screen.getByLabelText(/证件类型/);
    fireEvent.change(idTypeSelect, { target: { value: '居民身份证' } });

    const idInput = screen.getByLabelText(/证件号码/);
    fireEvent.change(idInput, { target: { value: '110101199001011234' } });
    
    const nameInput = screen.getByLabelText(/姓名/);
    fireEvent.change(nameInput, { target: { value: 'CorrectName' } });

    fireEvent.click(screen.getByText('保存'));

    await waitFor(() => {
      expect(screen.getByText('该乘车人已存在')).toBeInTheDocument();
    });
  });
});
