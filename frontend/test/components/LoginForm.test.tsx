import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from '../../src/components/LoginForm';

test('Given login form initial When page loads Then identifier and password inputs are empty with placeholders', () => {
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );
  const idInput = screen.getByPlaceholderText('用户名/邮箱/手机号') as HTMLInputElement;
  const pwdInput = screen.getByPlaceholderText('密码') as HTMLInputElement;
  expect(idInput.value).toBe('');
  expect(pwdInput.value).toBe('');
});

test('Given no identifier When clicking login Then shows error 请输入用户名！', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );
  const btn = screen.getByRole('button', { name: '立即登录' });
  await user.click(btn);
  expect(await screen.findByText('❗请输入用户名！')).toBeInTheDocument();
});

test('Given identifier entered but no password When clicking login Then shows error ❗请输入密码！', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );
  const idInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
  await user.type(idInput, 'user@example.com');
  const btn = screen.getByRole('button', { name: '立即登录' });
  await user.click(btn);
  expect(await screen.findByText('❗请输入密码！')).toBeInTheDocument();
});

test('Given password shorter than 6 When clicking login Then shows error ❗密码长度不能小于6位！', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );
  const idInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
  const pwdInput = screen.getByPlaceholderText('密码');
  await user.type(idInput, 'user');
  await user.type(pwdInput, '12345');
  const btn = screen.getByRole('button', { name: '立即登录' });
  await user.click(btn);
  expect(await screen.findByText('❗密码长度不能小于6位！')).toBeInTheDocument();
});

test('Given valid identifier and password When clicking login Then opens SMS verification modal', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );
  const idInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
  const pwdInput = screen.getByPlaceholderText('密码');
  await user.type(idInput, 'user');
  await user.type(pwdInput, '123456');
  const btn = screen.getByRole('button', { name: '立即登录' });
  await user.click(btn);
  expect(await screen.findByText('短信验证')).toBeInTheDocument();
});
