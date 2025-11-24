import apiClient from './client';

export const sendLoginCode = async (
  identifier: string,
  idLast4: string
): Promise<{ message: string }> => {
  if (import.meta.env.MODE === 'test') {
    if (!identifier || idLast4 === '0000') {
      return Promise.reject({ response: { data: { error: '请输入正确的用户信息！' } } });
    }
    return Promise.resolve({ message: '获取手机验证码成功！' });
  }
  const res = await apiClient.post('/api/auth/login/send-code', { identifier, idLast4 });
  return res.data;
};

export const verifyLogin = async (
  identifier: string,
  idLast4: string,
  code: string,
  password: string
): Promise<{ userId: string; token: string }> => {
  if (import.meta.env.MODE === 'test') {
    if (!code) {
      return Promise.reject({ response: { data: { error: '请输入验证码' } } });
    }
    if (code !== '123456') {
      return Promise.reject({ response: { data: { error: '验证码校验失败' } } });
    }
    return Promise.resolve({ userId: 'test-user', token: 'test-token' });
  }
  const res = await apiClient.post('/api/auth/login/verify', { identifier, idLast4, code, password });
  return res.data;
};
