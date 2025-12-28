import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import TicketTable from '../../src/components/TicketTable';
import React from 'react';

describe('TicketTable', () => {
  const mockRows = [
    { name: '张三', idNumber: '1101**********1234', idType: '身份证', ticketType: '成人票', seatType: '二等座' }
  ];

  test('Given 用户选择一位乘车人 When 界面加载 Then 显示该乘车人的脱敏证件号', () => {
    render(<TicketTable rows={mockRows} />);
    expect(screen.getByDisplayValue('张三')).toBeDefined();
    expect(screen.getByDisplayValue('1101**********1234')).toBeDefined();
  });

  test('Given 席别选择框初始化 When 购票界面已经正确加载 Then 默认选择二等座', () => {
    render(<TicketTable rows={mockRows} />);
    const select = screen.getByLabelText('席别') as HTMLSelectElement;
    expect(select.value).toBe('二等座');
  });
});
