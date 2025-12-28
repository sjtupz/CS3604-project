import { render, screen } from '@testing-library/react';
import { describe, test, beforeEach, vi } from 'vitest';
import PersonalCenterOrdersPage from '../../src/pages/PersonalCenterOrdersPage';
import userEvent from '@testing-library/user-event';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...mod, useNavigate: () => navigateMock };
});

describe('PersonalCenterOrdersPage', () => {
  test('Given 用户进入个人中心订单 When 查看未完成订单 Then 显示表头与“取消订单”“去支付”按钮', () => {
    render(<PersonalCenterOrdersPage />);
    expect(screen.getByText('未完成订单')).toBeInTheDocument();
    expect(screen.getByText('车次信息')).toBeInTheDocument();
    expect(screen.getByText('旅客信息')).toBeInTheDocument();
    expect(screen.getByText('席位信息')).toBeInTheDocument();
    expect(screen.getByText('票价')).toBeInTheDocument();
    expect(screen.getByText('车票状态')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消订单' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '去支付' })).toBeInTheDocument();
  });

  test('Given 用户进入个人中心订单 When 查看未出行订单 Then 显示表头与“已支付”和“退票”', () => {
    render(<PersonalCenterOrdersPage />);
    expect(screen.getByText('未出行订单')).toBeInTheDocument();
    expect(screen.getByText('车次信息')).toBeInTheDocument();
    expect(screen.getByText('旅客信息')).toBeInTheDocument();
    expect(screen.getByText('席位信息')).toBeInTheDocument();
    expect(screen.getByText('票价')).toBeInTheDocument();
    expect(screen.getByText('订单状态')).toBeInTheDocument();
    expect(screen.getByText('已支付')).toBeInTheDocument();
    expect(screen.getByText('退票')).toBeInTheDocument();
  });

  beforeEach(() => {
    navigateMock.mockReset();
  });

  test('Given 用户在个人中心页 When 点击“取消订单”按钮 Then 弹出“您确认取消订单吗？”弹窗', async () => {
    render(<PersonalCenterOrdersPage />);
    await userEvent.click(screen.getByRole('button', { name: '取消订单' }));
    expect(screen.getByText('您确认取消订单吗？')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '确认' })).toBeInTheDocument();
  });

  test('Given “您确认取消订单吗？”弹窗已弹出 When 点击“取消” Then 弹窗关闭并返回个人中心页', async () => {
    render(<PersonalCenterOrdersPage />);
    await userEvent.click(screen.getByRole('button', { name: '取消订单' }));
    await userEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(screen.queryByText('您确认取消订单吗？')).not.toBeInTheDocument();
  });

  test('Given “您确认取消订单吗？”弹窗已弹出 When 点击“确认” Then 订单被取消并跳转到车次列表页', async () => {
    render(<PersonalCenterOrdersPage />);
    await userEvent.click(screen.getByRole('button', { name: '取消订单' }));
    await userEvent.click(screen.getByRole('button', { name: '确认' }));
    expect(navigateMock).toHaveBeenCalledWith('/tickets');
  });

  test('Given 用户在个人中心页 When 点击“去支付” Then 跳转到支付页面', async () => {
    render(<PersonalCenterOrdersPage />);
    await userEvent.click(screen.getByRole('button', { name: '去支付' }));
    expect(navigateMock).toHaveBeenCalledWith('/payment');
  });
});
