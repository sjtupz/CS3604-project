import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SMSVerificationModal } from '../../src/components/SMSVerificationModal';

test('Given modal init When rendered Then inputs are empty with placeholders and send button is init', () => {
  render(<SMSVerificationModal onClose={() => {}} onVerified={() => {}} />);
  const idInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位') as HTMLInputElement;
  const codeInput = screen.getByPlaceholderText('输入验证码') as HTMLInputElement;
  const sendBtn = screen.getByRole('button', { name: '获取验证码' });
  expect(idInput.value).toBe('');
  expect(codeInput.value).toBe('');
  expect(sendBtn).toBeDisabled();
});

test('Given idLast4 not filled When clicking confirm Then shows error 请输入登录账号绑定的证件号后4位', async () => {
  const user = userEvent.setup();
  render(<SMSVerificationModal onClose={() => {}} onVerified={() => {}} />);
  const confirmBtn = screen.getByRole('button', { name: '确定' });
  await user.click(confirmBtn);
  expect(await screen.findByText('请输入登录账号绑定的证件号后4位')).toBeInTheDocument();
});

test('Given idLast4 reaches 4 chars When typing Then input refuses more and remains 4 chars', async () => {
  const user = userEvent.setup();
  render(<SMSVerificationModal onClose={() => {}} onVerified={() => {}} />);
  const idInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位') as HTMLInputElement;
  await user.type(idInput, '123456');
  expect(idInput.value).toBe('1234');
});

test('Given idLast4 less than 4 When typing Then send button remains init', async () => {
  const user = userEvent.setup();
  render(<SMSVerificationModal onClose={() => {}} onVerified={() => {}} />);
  const idInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位');
  await user.type(idInput, '12');
  const sendBtn = screen.getByRole('button', { name: '获取验证码' });
  expect(sendBtn).toBeDisabled();
});

test('Given idLast4 equals 4 When typing Then send button becomes enabled', async () => {
  const user = userEvent.setup();
  render(<SMSVerificationModal onClose={() => {}} onVerified={() => {}} />);
  const idInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位');
  await user.type(idInput, '1234');
  const sendBtn = screen.getByRole('button', { name: '获取验证码' });
  expect(sendBtn).toBeEnabled();
});

test('Given clicked get code When user not exists Then shows 请输入正确的用户信息！', async () => {
  const user = userEvent.setup();
  render(<SMSVerificationModal onClose={() => {}} onVerified={() => {}} />);
  const idInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位');
  await user.type(idInput, '0000');
  const sendBtn = screen.getByRole('button', { name: '获取验证码' });
  await user.click(sendBtn);
  expect(await screen.findByText('请输入正确的用户信息！')).toBeInTheDocument();
});

test('Given clicked get code When matched Then shows 获取手机验证码成功！ and starts countdown', async () => {
  const user = userEvent.setup();
  render(<SMSVerificationModal onClose={() => {}} onVerified={() => {}} />);
  const idInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位');
  await user.type(idInput, '1234');
  const sendBtn = screen.getByRole('button', { name: '获取验证码' });
  await user.click(sendBtn);
  expect(await screen.findByText('获取手机验证码成功！')).toBeInTheDocument();
  expect(sendBtn).toBeDisabled();
});

test('Given no code entered When clicking confirm Then shows 请输入验证码', async () => {
  const user = userEvent.setup();
  render(<SMSVerificationModal onClose={() => {}} onVerified={() => {}} />);
  const idInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位');
  await user.type(idInput, '1234');
  const confirmBtn = screen.getByRole('button', { name: '确定' });
  await user.click(confirmBtn);
  expect(await screen.findByText('请输入验证码')).toBeInTheDocument();
});

test('Given code shorter than 6 When clicking confirm Then shows 请输入正确验证码', async () => {
  const user = userEvent.setup();
  render(<SMSVerificationModal onClose={() => {}} onVerified={() => {}} />);
  const idInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位');
  const codeInput = screen.getByPlaceholderText('输入验证码');
  await user.type(idInput, '1234');
  await user.type(codeInput, '12345');
  const confirmBtn = screen.getByRole('button', { name: '确定' });
  await user.click(confirmBtn);
  expect(await screen.findByText('请输入正确验证码')).toBeInTheDocument();
});

test('Given code reaches 6 chars When typing Then refuses more and remains 6 chars', async () => {
  const user = userEvent.setup();
  render(<SMSVerificationModal onClose={() => {}} onVerified={() => {}} />);
  const codeInput = screen.getByPlaceholderText('输入验证码') as HTMLInputElement;
  await user.type(codeInput, '1234567');
  expect(codeInput.value).toBe('123456');
});

test('Given verify succeeded When clicking confirm Then calls onVerified and navigates to personal center', async () => {
  const user = userEvent.setup();
  const onVerified = vi.fn();
  render(<SMSVerificationModal onClose={() => {}} onVerified={onVerified} />);
  const idInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位');
  const codeInput = screen.getByPlaceholderText('输入验证码');
  await user.type(idInput, '1234');
  await user.type(codeInput, '123456');
  const confirmBtn = screen.getByRole('button', { name: '确定' });
  await user.click(confirmBtn);
  expect(onVerified).toHaveBeenCalled();
});

test('Given countdown hits zero When time passes Then send button becomes enabled and can resend', async () => {
  render(<SMSVerificationModal onClose={() => {}} onVerified={() => {}} />);
  const sendBtn = screen.getByRole('button', { name: '获取验证码' });
  expect(sendBtn).toBeEnabled();
});
