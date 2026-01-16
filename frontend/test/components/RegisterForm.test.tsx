import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '../../src/components/RegisterForm';
import * as userApi from '../../src/api/user';

vi.mock('../../src/api/user');

describe('UI-RegisterForm Scenarios', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userApi.checkUsername).mockResolvedValue({ isAvailable: true });
    vi.mocked(userApi.checkIdentityNumber).mockResolvedValue({ isAvailable: true });
    vi.mocked(userApi.checkPhoneNumber).mockResolvedValue({ isAvailable: true });
    vi.mocked(userApi.registerUser).mockResolvedValue(undefined);
  });

  // 场景 3.3.1 - 用户名已被占用
  test('Given the username is already taken When the field loses focus Then it shows a username taken error message', async () => {
    vi.mocked(userApi.checkUsername).mockResolvedValue({ isAvailable: false });

    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const usernameInput = screen.getByLabelText('用户名');

    fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
    fireEvent.blur(usernameInput);

    const errorMessage = await screen.findByText('该用户名已经占用，请重新选择用户名');
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

    const errorMessage = await screen.findByText('确认密码与密码不同');
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

  // 场景 3.3.11 - 手机号码未填写点击下一步
  test('Given the phone number is empty When user clicks next Then it shows a required field error and modal', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const termsCheckbox = screen.getByLabelText('我已同意《中国铁路客户服务中心网站服务条款》《隐私权政策》');
    const nextButton = screen.getByRole('button', { name: '下一步' });

    fireEvent.click(termsCheckbox);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('❌请输入手机号码！')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('请输入手机号，以完成用户校验。')).toBeInTheDocument();
    });
  });


  test('Given user enters the register page When page loads Then right-side prompt shows username rule text', () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    expect(screen.getByText('6-30位字母、数字或"_"，字母开头')).toBeInTheDocument();
  });

  test('Given user is typing username When exceeds 30 characters Then input should cap at 30', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const usernameInput = screen.getByLabelText('用户名');
    const longUsername = 'a'.repeat(35);
    await userEvent.type(usernameInput, longUsername);
    expect((usernameInput as HTMLInputElement).value.length).toBe(30);
  });

  test('Given username contains invalid characters When field loses focus Then it shows unified format error message', async () => {
    vi.mocked(userApi.checkUsername).mockResolvedValue({ isAvailable: true });
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const usernameInput = screen.getByLabelText('用户名');
    fireEvent.change(usernameInput, { target: { value: 'user!' } });
    fireEvent.blur(usernameInput);
    const errorMessage = await screen.findByText('❌用户名只能由字母、数字和_组成,须以字母开头！');
    expect(errorMessage).toBeInTheDocument();
  });

  test('Given username is valid and available When field loses focus Then it shows success prompt on the right', async () => {
    vi.mocked(userApi.checkUsername).mockResolvedValue({ isAvailable: true });
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const usernameInput = screen.getByLabelText('用户名');
    fireEvent.change(usernameInput, { target: { value: 'valid_user' } });
    fireEvent.blur(usernameInput);
    const successPrompt = await screen.findByText('✅6-30位字母、数字或“_”,字母开头');
    expect(successPrompt).toBeInTheDocument();
  });

  test('Given username exceeds 30 characters When field loses focus Then it shows unified format error message', async () => {
    vi.mocked(userApi.checkUsername).mockResolvedValue({ isAvailable: true });
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const usernameInput = screen.getByLabelText('用户名');
    fireEvent.change(usernameInput, { target: { value: 'A'.repeat(31) } });
    fireEvent.blur(usernameInput);
    const errorMessage = await screen.findByText('❌用户名只能由字母、数字和_组成,须以字母开头！');
    expect(errorMessage).toBeInTheDocument();
  });

  test('Given user types password over 20 characters When input continues Then it should cap at 20', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const passwordInput = screen.getByLabelText('登录密码');
    const longPassword = 'a'.repeat(25);
    await userEvent.type(passwordInput, longPassword);
    expect((passwordInput as HTMLInputElement).value.length).toBe(20);
  });

  // 3.3.3 - 确认密码与登录密码一致时显示✅
  test('Given passwords match When user leaves confirm password Then it shows a right-side success indicator', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const passwordInput = screen.getByLabelText('登录密码');
    const confirmPasswordInput = screen.getByLabelText('确认密码');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.blur(confirmPasswordInput);

    const successIcon = await screen.findByText('✅');
    expect(successIcon).toBeInTheDocument();
  });

  // 3.3.4 - 证件类型默认值为“居民身份证”
  test('Given user enters register page When page loads Then identity type defaults to 居民身份证', () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const identityTypeSelect = screen.getByLabelText('证件类型') as HTMLSelectElement;
    expect(identityTypeSelect.value).toBe('居民身份证');
  });

  // 3.3.5 - 姓名右侧黄色提示
  test('Given register page When page loads Then full name field shows yellow hint', () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const group = screen.getByLabelText('姓名').closest('.form-group') as HTMLElement;
    expect(group).toBeTruthy();
    expect(group.querySelector('.hint-message')?.textContent).toBe('（用于身份核验，请正确填写）');
  });

  // 3.3.5 - 姓名包含非法字符时提示
  test('Given full name contains invalid characters When field loses focus Then it shows invalid name error', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const fullNameInput = screen.getByLabelText('姓名');

    fireEvent.change(fullNameInput, { target: { value: 'John!' } });
    fireEvent.blur(fullNameInput);

    const errorMessage = await screen.findByText('❌请输入您的姓名！');
    expect(errorMessage).toBeInTheDocument();
  });

  // 3.3.6 - 证件号码右侧黄色提示
  test('Given register page When page loads Then identity number field shows yellow hint', () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const group = screen.getByLabelText('证件号码').closest('.form-group') as HTMLElement;
    expect(group).toBeTruthy();
    expect(group.querySelector('.hint-message')?.textContent).toBe('（用于身份核验，请正确填写）');
  });

  // 3.3.6 - 证件号码输入达到字符限制时应上限为18
  test('Given user types identity number over 18 characters When input continues Then it should cap at 18', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const identityNumberInput = screen.getByLabelText('证件号码');
    const longId = '1'.repeat(25);
    await userEvent.type(identityNumberInput, longId);
    expect((identityNumberInput as HTMLInputElement).value.length).toBe(18);
  });

  // 场景 3.3.6 - 证件号码包含英文字符（除最后一位X）提示错误
  test('Given identity number contains letters not as last X When field loses focus Then it shows id number format error', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const identityNumberInput = screen.getByLabelText('证件号码');

    fireEvent.change(identityNumberInput, { target: { value: '12345678901234567A' } });
    fireEvent.blur(identityNumberInput);

    const errorMessage = await screen.findByText('❌请正确输入18位的证件号码！');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 - 证件号码校验位错误
  test('Given identity number has invalid checksum When field loses focus Then it shows id number format error', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const identityNumberInput = screen.getByLabelText('证件号码');

    fireEvent.change(identityNumberInput, { target: { value: '110101199003074478' } }); // Checksum should be 7
    fireEvent.blur(identityNumberInput);

    const errorMessage = await screen.findByText('❌请正确输入18位的证件号码！');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 - 证件号码日期错误
  test('Given identity number has invalid date When field loses focus Then it shows id number format error', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const identityNumberInput = screen.getByLabelText('证件号码');

    fireEvent.change(identityNumberInput, { target: { value: '110101202302304477' } }); // Feb 30th
    fireEvent.blur(identityNumberInput);

    const errorMessage = await screen.findByText('❌请正确输入18位的证件号码！');
    expect(errorMessage).toBeInTheDocument();
  });

  // 场景 - 证件号码省份错误
  test('Given identity number has invalid province code When field loses focus Then it shows id number format error', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const identityNumberInput = screen.getByLabelText('证件号码');

    fireEvent.change(identityNumberInput, { target: { value: '990101199003074477' } }); // 99 Invalid
    fireEvent.blur(identityNumberInput);

    const errorMessage = await screen.findByText('❌请正确输入18位的证件号码！');
    expect(errorMessage).toBeInTheDocument();
  });

  // 3.3.7 - 旅客类型默认值为“成人”
  test('Given user enters register page When page loads Then passenger type defaults to 成人', () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const passengerTypeSelect = screen.getByLabelText('旅客类型') as HTMLSelectElement;
    expect(passengerTypeSelect.value).toBe('成人');
  });

  // 3.3.8 - 邮箱错误提示文案为“请输入有效的电子邮件地址！”
  test('Given invalid email format When field loses focus Then it shows email address prompt', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const emailInput = screen.getByLabelText('电子邮箱');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    const errorMessage = await screen.findByText('请输入有效的电子邮件地址！');
    expect(errorMessage).toBeInTheDocument();
  });

  // 3.3.9 - 手机号右侧黄色提示
  test('Given register page When page loads Then phone field shows yellow hint', () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    expect(screen.getByText('请正确填写手机号码，稍后将向该手机号码发送短信验证码')).toBeInTheDocument();
  });

  // 3.3.9 - 手机号输入达到字符限制应上限为11
  test('Given user types phone over 11 characters When input continues Then it should cap at 11', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const phoneInput = screen.getByLabelText('手机号码');
    const longPhone = '1'.repeat(20);
    await userEvent.type(phoneInput, longPhone);
    expect((phoneInput as HTMLInputElement).value.length).toBe(11);
  });

  // 3.3.11 - 未填写手机号点击下一步弹窗提示（优先）
  test('Given phone number is empty When click next Then it shows inline error AND modal', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const nextButton = screen.getByRole('button', { name: '下一步' });
    fireEvent.click(nextButton);
    await waitFor(() => {
      // Inline error
      expect(screen.getByText('❌请输入手机号码！')).toBeInTheDocument();
      // Modal
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('请输入手机号，以完成用户校验。')).toBeInTheDocument();
    });
  });

  // 3.3.10 - 条款未勾选点击下一步弹窗提示（手机号已填写时）
  test('Given all fields are valid and terms not checked When user clicks next Then a modal shows terms confirmation text', async () => {
    vi.mocked(userApi.checkUsername).mockResolvedValue({ isAvailable: true });
    vi.mocked(userApi.checkIdentityNumber).mockResolvedValue({ isAvailable: true });
    vi.mocked(userApi.checkPhoneNumber).mockResolvedValue({ isAvailable: true });
    
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    
    // Fill all required fields
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'valid_user' } });
    fireEvent.change(screen.getByLabelText('登录密码'), { target: { value: 'Password123_' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'Password123_' } });
    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: '张三' } });
    fireEvent.change(screen.getByLabelText('证件号码'), { target: { value: '110101199003074477' } });
    fireEvent.change(screen.getByLabelText('手机号码'), { target: { value: '13800138000' } });
    
    const nextButton = screen.getByRole('button', { name: '下一步' });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('请确认服务条款！')).toBeInTheDocument();
    });
  });

  // 3.3.11 - 输入已注册的证件号码点击下一步弹窗显示短文案（优先校验）
  test('Given identity is registered When user clicks next Then a modal shows identity registered popup', async () => {
    vi.mocked(userApi.checkIdentityNumber).mockResolvedValue({ isAvailable: false, message: '该证件号码已被注册' });
    vi.mocked(userApi.checkPhoneNumber).mockResolvedValue({ isAvailable: true });

    render(<RegisterForm onRegisterSuccess={() => {}} />);
    fireEvent.click(screen.getByLabelText('我已同意《中国铁路客户服务中心网站服务条款》《隐私权政策》'));
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('登录密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: '张三' } });
    fireEvent.change(screen.getByLabelText('证件号码'), { target: { value: '110101199003074477' } });
    fireEvent.change(screen.getByLabelText('旅客类型'), { target: { value: '成人' } });
    fireEvent.change(screen.getByLabelText('证件类型'), { target: { value: '居民身份证' } });
    fireEvent.change(screen.getByLabelText('手机号码'), { target: { value: '13800138000' } });
    fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('该证件号码已被注册。请确认是否您本人注册，“是”请使用原账号登录，“不是”请通过铁路12306App办理抢注或持该证件原件到就近的办理客运业务的铁路车站办理被抢注处理，完成后即可继续注册，或致电12306客服咨询。')).toBeInTheDocument();
    });

    expect(userApi.checkPhoneNumber).not.toHaveBeenCalled();
  });

  // 3.3.11 - 输入已注册的邮箱点击下一步弹窗显示长文案
  test('Given email is registered When user clicks next Then a modal shows email registered guidance', async () => {
    vi.mocked(userApi.registerUser).mockRejectedValue({ response: { status: 409, data: { error: '该电子邮箱已被注册' } } });
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    fireEvent.click(screen.getByLabelText('我已同意《中国铁路客户服务中心网站服务条款》《隐私权政策》'));
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('登录密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: '张三' } });
    fireEvent.change(screen.getByLabelText('证件号码'), { target: { value: '110101199003074477' } });
    fireEvent.change(screen.getByLabelText('旅客类型'), { target: { value: '成人' } });
    fireEvent.change(screen.getByLabelText('证件类型'), { target: { value: '居民身份证' } });
    fireEvent.change(screen.getByLabelText('手机号码'), { target: { value: '13800138000' } });
    fireEvent.change(screen.getByLabelText('电子邮箱'), { target: { value: 'example@domain.com' } });
    fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('您输入的邮箱已被其他注册用户使用，请确认是否本人注册。如果此邮箱是本人注册，您可使用此邮箱进行登录，或返回登录页点击忘记密码进行重置密码；如果邮箱不是您注册的，您可更换邮箱或致电12306客服协助处理。')).toBeInTheDocument();
    });
  });

  // 3.3.11 - 输入已注册的手机号码点击下一步弹窗显示短文案（优先校验）
  test('Given phone is registered When user clicks next Then a modal shows phone registered popup', async () => {
    vi.mocked(userApi.checkIdentityNumber).mockResolvedValue({ isAvailable: true });
    vi.mocked(userApi.checkPhoneNumber).mockResolvedValue({ isAvailable: false, message: '您输入的手机号码已被其他注册用户使用' });

    render(<RegisterForm onRegisterSuccess={() => {}} />);
    fireEvent.click(screen.getByLabelText('我已同意《中国铁路客户服务中心网站服务条款》《隐私权政策》'));
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('登录密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: '张三' } });
    fireEvent.change(screen.getByLabelText('证件号码'), { target: { value: '110101199003074477' } });
    fireEvent.change(screen.getByLabelText('旅客类型'), { target: { value: '成人' } });
    fireEvent.change(screen.getByLabelText('证件类型'), { target: { value: '居民身份证' } });
    fireEvent.change(screen.getByLabelText('手机号码'), { target: { value: '13800138000' } });
    fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('您输入的手机号码已被其他注册用户使用，请确认是否本人注册。如果此手机号是本人注册，您可使用此手机号进行登录，或返回登录页点击忘记密码进行重置密码；如果手机号不是您注册的，您可更换手机号码或致电12306客服协助处理。')).toBeInTheDocument();
    });

    expect(userApi.checkIdentityNumber).toHaveBeenCalled();
    expect(userApi.checkPhoneNumber).toHaveBeenCalled();
  });

  test('Given 用户在注册页面 And 用户已填写手机号，且已勾选同意用户协议 When 用户的部分必填项未规范填写，并点击“下一步”按钮 Then 未通过规范认证的输入框下方若已经存在系统提示，则直接保留之前的提示信息；如果没有系统提示，则显示相应的提示信息', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    fireEvent.change(screen.getByLabelText('手机号码'), { target: { value: '13800138000' } });
    fireEvent.click(screen.getByLabelText('我已同意《中国铁路客户服务中心网站服务条款》《隐私权政策》'));
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText('登录密码'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: '456' } });
    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: '张' } });
    fireEvent.change(screen.getByLabelText('证件号码'), { target: { value: '12345678901234567' } });
    fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    await waitFor(() => {
      expect(screen.getByText('用户名长度不能小于6位')).toBeInTheDocument();
      expect(screen.getByText('密码长度不能小于6位')).toBeInTheDocument();
      expect(screen.getByText('确认密码与密码不同')).toBeInTheDocument();
      expect(screen.getByText('姓名长度不能小于2位')).toBeInTheDocument();
      expect(screen.getByText('证件号码长度不能小于18位')).toBeInTheDocument();
    });
  });

  // 3.3.11 - 关闭弹窗后聚焦手机号输入框
  test('Given modal is shown for empty phone When user closes modal Then phone input receives focus', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    const nextButton = screen.getByRole('button', { name: '下一步' });
    fireEvent.click(nextButton);
    
    // Wait for modal
    const modalButton = await screen.findByRole('button', { name: '确定' });
    
    // Click OK
    fireEvent.click(modalButton);
    
    // Check focus
    const phoneInput = screen.getByLabelText('手机号码');
    await waitFor(() => {
        expect(phoneInput).toHaveFocus();
    });
  });
});
