import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { RegisterVerificationPage } from '../../src/pages/RegisterVerificationPage';

test('Given 用户已填写手机号并进入验证码输入页 When 页面加载 Then 自动发送验证码并显示占位与倒计时', async () => {
  render(<RegisterVerificationPage />);
  expect(await screen.findByPlaceholderText('请输入短信验证码')).toBeInTheDocument();
  const resendBtn = screen.getByRole('button', { name: '重新发送验证码' });
  expect(resendBtn).toBeDisabled();
  expect(screen.getByText(/秒后重新发送/)).toBeInTheDocument();
});

test('Given 处于倒计时 When 页面加载 Then 重新发送按钮不可点击', async () => {
  render(<RegisterVerificationPage />);
  const resendBtn = screen.getByRole('button', { name: '重新发送验证码' });
  expect(resendBtn).toBeDisabled();
  expect(screen.getByText(/秒后重新发送/)).toBeInTheDocument();
});

test('Given 重新发送按钮可点击 When 用户点击 Then 重新发送验证码并重置倒计时', async () => {
  const user = userEvent.setup();
  render(<RegisterVerificationPage />);
  const resendBtn = screen.getByRole('button', { name: '重新发送验证码' });
  await user.click(resendBtn);
  expect(await screen.findByText('获取手机验证码成功！')).toBeInTheDocument();
  expect(resendBtn).toBeDisabled();
});

test('Given 用户输入错误验证码 When 点击下一步 Then 显示错误文案', async () => {
  const user = userEvent.setup();
  render(<RegisterVerificationPage />);
  const codeInput = screen.getByPlaceholderText('请输入短信验证码');
  await user.type(codeInput, '000000');
  const nextBtn = screen.getByRole('button', { name: '下一步' });
  await user.click(nextBtn);
  expect(await screen.findByText('❌验证码错误，请重新输入')).toBeInTheDocument();
});

test('Given 未输入验证码 When 点击下一步 Then 显示请输入验证码', async () => {
  const user = userEvent.setup();
  render(<RegisterVerificationPage />);
  const nextBtn = screen.getByRole('button', { name: '下一步' });
  await user.click(nextBtn);
  expect(await screen.findByText('❌请输入验证码')).toBeInTheDocument();
});

test('Given 输入正确验证码 When 点击下一步 Then 跳转至注册成功页', async () => {
  const user = userEvent.setup();
  render(<RegisterVerificationPage />);
  const codeInput = screen.getByPlaceholderText('请输入短信验证码');
  await user.type(codeInput, '123456');
  const nextBtn = screen.getByRole('button', { name: '下一步' });
  await user.click(nextBtn);
  expect(await screen.findByText('恭喜您，注册成功！')).toBeInTheDocument();
});
