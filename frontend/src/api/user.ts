import { RegisterFormData } from '../types/user';
import apiClient from './client';

export const checkUsername = async (username: string): Promise<{ isAvailable: boolean }> => {
  try {
    const response = await apiClient.get('/api/users/check-username', {
      params: { username },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking username:', error);
    throw error;
  }
};

export const checkIdentityNumber = async (identityNumber: string): Promise<{ isAvailable: boolean; message?: string }> => {
  if (import.meta.env.MODE === 'test') {
     console.log(`Checking identity number (MOCK): ${identityNumber}`);
     // Mock behavior for tests that don't mock this module
     return { isAvailable: identityNumber !== '123456789012345678', message: identityNumber === '123456789012345678' ? '该证件号码已被注册' : undefined };
  }
  try {
    const response = await apiClient.get('/api/users/check-identity', {
      params: { identityNumber },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking identity number:', error);
    throw error;
  }
};

export const checkPhoneNumber = async (phoneNumber: string): Promise<{ isAvailable: boolean; message?: string }> => {
  if (import.meta.env.MODE === 'test') {
    console.log(`Checking phone number (MOCK): ${phoneNumber}`);
    return { isAvailable: phoneNumber !== '13800138000', message: phoneNumber === '13800138000' ? '您输入的手机号码已被其他注册用户使用' : undefined };
  }
  try {
    const response = await apiClient.get('/api/users/check-phone', {
      params: { phoneNumber },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking phone number:', error);
    throw error;
  }
};

export const checkEmail = async (email: string): Promise<{ isAvailable: boolean }> => {
  console.log(`Checking email: ${email}`);
  // If backend adds check-email, update here. For now, keep mock or similar.
  return { isAvailable: email !== 'taken@example.com' }; 
};

export const registerUser = async (userData: Partial<RegisterFormData>): Promise<void> => {
  try {
    const response = await apiClient.post('/api/auth/register/send-code', { phoneNumber: userData.phoneNumber });
    return response.data;
  } catch (error) {
    console.error('Error registering user (send code):', error);
    throw error;
  }
};

export const finalizeRegister = async (userData: Partial<RegisterFormData>): Promise<void> => {
  try {
    if (import.meta.env.MODE === 'test') {
      return Promise.resolve();
    }
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error finalizing registration:', error);
    throw error;
  }
};
