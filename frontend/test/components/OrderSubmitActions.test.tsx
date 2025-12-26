import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import OrderSubmitActions from '../../src/components/OrderSubmitActions';
import React from 'react';

describe('OrderSubmitActions', () => {
  test('Given 选项按钮 When 点击“上一页” Then 触发 onBack 回调', () => {
    const onBack = vi.fn();
    render(<OrderSubmitActions onBack={onBack} onSubmit={() => {}} />);
    
    fireEvent.click(screen.getByText('上一页'));
    expect(onBack).toHaveBeenCalled();
  });

  test('Given 选项按钮 When 点击“提交订单” Then 触发 onSubmit 回调', () => {
    const onSubmit = vi.fn();
    render(<OrderSubmitActions onBack={() => {}} onSubmit={onSubmit} />);
    
    fireEvent.click(screen.getByText('提交订单'));
    expect(onSubmit).toHaveBeenCalled();
  });
});
