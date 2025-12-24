import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import PassengerSelection from '../../src/components/PassengerSelection';
import React from 'react';

describe('PassengerSelection', () => {
  const mockPassengers = [
    { passengerId: '1', name: '张三', idNumber: '110101199001011234', idType: '身份证' },
    { passengerId: '2', name: '李四', idNumber: '110101199001015678', idType: '身份证' }
  ];

  test('Given 用户点击乘车人勾选框 When 点击某个姓名 Then 触发 onToggle 回调', () => {
    const onToggle = vi.fn();
    render(<PassengerSelection passengers={mockPassengers} selectedPassengerIds={[]} onToggle={onToggle} />);
    
    const checkbox = screen.getByLabelText('张三');
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(mockPassengers[0]);
  });
});
