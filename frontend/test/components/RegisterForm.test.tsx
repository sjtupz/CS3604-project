import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import { RegisterForm } from '../../src/components/RegisterForm';
import * as userApi from '../../src/api/user';

vi.mock('../../src/api/user');

describe('UI-RegisterForm Scenarios', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userApi.checkUsername).mockResolvedValue({ isAvailable: true });
    vi.mocked(userApi.registerUser).mockResolvedValue(undefined);
  });

  // 场景 3.3.1 - 用户名已被占用
  test('Given the username is already taken When the field loses focus Then it shows a username taken error message', async () => {
    vi.mocked(userApi.checkUsername).mockResolvedValue({ isAvailable: false });

    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const usernameInput = screen.getByLabelText('用户名');

    fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
    fireEvent.blur(usernameInput);

    const errorMessage = await screen.findByText('用户名已被占用');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 3.3.1 - 用户名长度小于6位
  test('Given user enters a username with less than 6 characters When the field loses focus Then it shows a length error message', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const usernameInput = screen.getByLabelText('用户名');

    fireEvent.change(usernameInput, { target: { value: 'user' } });
    fireEvent.blur(usernameInput);

    const errorMessage = await screen.findByText('用户名长度不能小于6位');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 3.3.1 - 用户名格式不正确
  test('Given user enters a username that does not start with a letter When the field loses focus Then it shows a format error message', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const usernameInput = screen.getByLabelText('用户名');

    fireEvent.change(usernameInput, { target: { value: '123456' } });
    fireEvent.blur(usernameInput);

    const errorMessage = await screen.findByText('用户名必须以字母开头');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 3.3.2 - 输入密码长度小于6位
  test('Given user enters a password with less than 6 characters When the field loses focus Then it shows a length error message', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const passwordInput = screen.getByLabelText('登录密码');

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);

    const errorMessage = await screen.findByText('密码长度不能小于6位');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 3.3.2 - 输入密码格式不正确
  test('Given user enters a password with only one character type When the field loses focus Then it shows a format error message', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const passwordInput = screen.getByLabelText('登录密码');

    // 只有数字
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.blur(passwordInput);

    let errorMessage = await screen.findByText('密码必须包含字母、数字或符号中的至少两种');
    expect(errorMessage).toBeInTheDocument();

    // 只有字母
    fireEvent.change(passwordInput, { target: { value: 'abcdef' } });
    fireEvent.blur(passwordInput);

    errorMessage = await screen.findByText('密码必须包含字母、数字或符号中的至少两种');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 3.3.3 - 确认密码与登录密码不一致
  test('Given passwords do not match When user leaves the confirm password field Then it shows a mismatch error', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const passwordInput = screen.getByLabelText('登录密码');
    const confirmPasswordInput = screen.getByLabelText('确认密码');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.blur(confirmPasswordInput);

    const errorMessage = await screen.findByText('两次输入的密码不一致');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 3.3.5 - 输入姓名长度小于2位
  test('Given user enters a full name with less than 2 characters When the field loses focus Then it shows a length error message', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const fullNameInput = screen.getByLabelText('姓名');

    fireEvent.change(fullNameInput, { target: { value: '张' } });
    fireEvent.blur(fullNameInput);

    const errorMessage = await screen.findByText('姓名长度不能小于2位');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 3.3.6 - 输入证件号码长度小于18位
  test('Given user enters an identity number with less than 18 characters When the field loses focus Then it shows a length error message', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const identityNumberInput = screen.getByLabelText('证件号码');

    fireEvent.change(identityNumberInput, { target: { value: '12345678901234567' } });
    fireEvent.blur(identityNumberInput);

    const errorMessage = await screen.findByText('证件号码长度不能小于18位');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 3.3.9 - 输入手机号码格式不正确
  test('Given user enters an invalid phone number format When the field loses focus Then it shows a format error message', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const phoneNumberInput = screen.getByLabelText('手机号码');

    fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
    fireEvent.blur(phoneNumberInput);

    const errorMessage = await screen.findByText('请输入有效的手机号码');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 3.3.8 - 用户输入的邮箱不含“@”符号和域名
  test('Given user enters an invalid email format When the field loses focus Then it shows a format error message', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const emailInput = screen.getByLabelText('电子邮箱');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    const errorMessage = await screen.findByText('请输入有效的电子邮箱');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 3.3.11 - 条款未勾选点击下一步
  test('Given the terms checkbox is not checked When user clicks next Then it shows a terms confirmation error', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const nextButton = screen.getByRole('button', { name: '下一步' });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('请勾选服务条款')).toBeInTheDocument();
    });
  });

  // 场景 3.3.11 - 未填写手机号点击下一步
  test('Given the phone number is empty When user clicks next Then it shows a required field error', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const termsCheckbox = screen.getByLabelText('我已同意《中国铁路客户服务中心网站服务条款》《隐私权政策》');
    const nextButton = screen.getByRole('button', { name: '下一步' });

    fireEvent.click(termsCheckbox);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('请输入手机号码')).toBeInTheDocument();
    });
  });

  // 场景 3.3.7 - 未选择旅客类型
  test('Given user does not select a passenger type When they click next Then it shows a selection error message', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const nextButton = screen.getByRole('button', { name: '下一步' });

    // 模拟勾选服务条款以绕过该验证
    const termsCheckbox = screen.getByLabelText('我已同意《中国铁路客户服务中心网站服务条款》《隐私权政策》');
    fireEvent.click(termsCheckbox);

    // 模拟填写所有其他必填字段
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('登录密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: '张三' } });
    fireEvent.change(screen.getByLabelText('证件号码'), { target: { value: '123456789012345678' } });
    fireEvent.change(screen.getByLabelText('手机号码'), { target: { value: '13800138000' } });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('请选择旅客类型')).toBeInTheDocument();
    });
  });

  // 场景 3.3.4 - 未选择证件类型
  test('Given user does not select an identity type When they click next Then it shows a selection error message', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const nextButton = screen.getByRole('button', { name: '下一步' });

    // 模拟勾选服务条款以绕过该验证
    const termsCheckbox = screen.getByLabelText('我已同意《中国铁路客户服务中心网站服务条款》《隐私权政策》');
    fireEvent.click(termsCheckbox);

    // 模拟填写所有其他必填字段
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('登录密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: '张三' } });
    fireEvent.change(screen.getByLabelText('证件号码'), { target: { value: '123456789012345678' } });
    fireEvent.change(screen.getByLabelText('手机号码'), { target: { value: '13800138000' } });
    fireEvent.change(screen.getByLabelText('旅客类型'), { target: { value: '成人' } });


    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('请选择证件类型')).toBeInTheDocument();
    });
  });
});
