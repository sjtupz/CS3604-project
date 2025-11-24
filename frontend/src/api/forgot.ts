import apiClient from './client';

export const sendForgotCode = async (
  payload: { phoneNumber: string; idLast4: string; countryCode?: string }
): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/auth/forgot/send-code', payload);
  return res.data;
};

export const verifyForgotCode = async (
  payload: { phoneNumber: string; code: string }
): Promise<{ ok: boolean }> => {
  const res = await apiClient.post('/api/auth/forgot/verify', payload);
  return res.data;
};

export const resetPassword = async (
  payload: { phoneNumber: string; newPassword: string }
): Promise<{ ok: boolean }> => {
  const res = await apiClient.post('/api/auth/forgot/reset', payload);
  return res.data;
};

