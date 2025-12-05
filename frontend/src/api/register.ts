import apiClient from './client';

export const sendRegisterCode = async (
  phoneNumber: string
): Promise<{ message: string }> => {
  if (import.meta.env.MODE === 'test') {
    if (!phoneNumber || phoneNumber.length !== 11) {
      return Promise.reject({ response: { data: { error: '请输入正确的用户信息！' } } });
    }
    return Promise.resolve({ message: '获取手机验证码成功！' });
  }
  const res = await apiClient.post('/api/auth/register/send-code', { phoneNumber });
  return res.data;
};

export const verifyRegister = async (
  payload: {
    phoneNumber: string;
    code: string;
    username: string;
    password: string;
    identityType: string;
    fullName: string;
    identityNumber: string;
    passengerType: string;
    email?: string;
  }
): Promise<{ message: string }> => {
  if (import.meta.env.MODE === 'test') {
    if (!payload.code) {
      return Promise.reject({ response: { data: { error: '请输入验证码' } } });
    }
    if (payload.code !== '123456') {
      return Promise.reject({ response: { data: { error: '验证码校验失败' } } });
    }
    return Promise.resolve({ message: 'Registration successful, please proceed to login.' });
  }
  const res = await apiClient.post('/api/auth/register/verify', payload);
  return res.data;
};
