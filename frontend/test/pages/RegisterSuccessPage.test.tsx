import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { RegisterSuccessPage } from '../../src/pages/RegisterSuccessPage';

test('Given 用户在注册成功页 When 页面加载 Then 显示成功文案与登录按钮', () => {
  render(<RegisterSuccessPage />);
  expect(screen.getByText('恭喜您，注册成功！')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
});

test('Given 用户在注册成功页 When 点击登录按钮 Then 跳转至登录页', async () => {
  const user = userEvent.setup();
  render(<RegisterSuccessPage />);
  const btn = screen.getByRole('button', { name: '登录' });
  await user.click(btn);
  expect(await screen.findByText('登录页面')).toBeInTheDocument();
});
