import { render, screen } from '@testing-library/react';
import { describe, test } from 'vitest';
import OrderCancelConfirmModal from '../../src/components/OrderCancelConfirmModal';

describe('OrderCancelConfirmModal', () => {
  test('Given 弹窗已弹出 When 用户点击按钮 Then 存在“取消”和“确认”按钮', () => {
    render(<OrderCancelConfirmModal />);
    expect(screen.getByText('您确认取消订单吗？')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '确认' })).toBeInTheDocument();
  });
});
