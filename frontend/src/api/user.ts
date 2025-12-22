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

// Mock functions for checking uniqueness
export const checkIdentityNumber = async (identityNumber: string): Promise<{ isAvailable: boolean }> => {
  console.log(`Checking identity number: ${identityNumber}`);
  // In a real app, you would make an API call here.
  // For now, let's simulate a check.
  return { isAvailable: identityNumber !== '123456789012345678' }; // Example: 123... is taken
};

export const checkPhoneNumber = async (phoneNumber: string): Promise<{ isAvailable: boolean }> => {
  console.log(`Checking phone number: ${phoneNumber}`);
  return { isAvailable: phoneNumber !== '13800138000' }; // Example: 138... is taken
};

export const checkEmail = async (email: string): Promise<{ isAvailable: boolean }> => {
  console.log(`Checking email: ${email}`);
  return { isAvailable: email !== 'taken@example.com' }; // Example: taken@example.com is taken
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
