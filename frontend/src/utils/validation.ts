// frontend/src/utils/validation.ts
import { ERROR_MESSAGES } from '../constants/registerForm';

export const validateUsername = (username: string): string | null => {
  if (username.length < 6) {
    return ERROR_MESSAGES.USERNAME_TOO_SHORT;
  }
  if (!/^[a-zA-Z]/.test(username)) {
    return ERROR_MESSAGES.USERNAME_INVALID_START;
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length > 0 && password.length < 6) {
    return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  }
  if (password.length > 0) {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);
    if (!((hasLetters && hasNumbers) || (hasLetters && hasSymbols) || (hasNumbers && hasSymbols))) {
      return ERROR_MESSAGES.PASSWORD_WEAK;
    }
  }
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORDS_NO_MATCH;
  }
  return null;
};

export const validateFullName = (fullName: string): string | null => {
  if (fullName.length > 0 && fullName.length < 2) {
    return ERROR_MESSAGES.FULL_NAME_TOO_SHORT;
  }
  return null;
};

export const validateIdentityNumber = (identityNumber: string): string | null => {
  if (identityNumber.length > 0 && identityNumber.length < 18) {
    return ERROR_MESSAGES.ID_NUMBER_TOO_SHORT;
  }
  return null;
};

export const validatePhoneNumber = (phoneNumber: string): string | null => {
  const phoneRegex = /^1[3-9]\\d{9}$/;
  if (phoneNumber.length > 0 && !phoneRegex.test(phoneNumber)) {
    return ERROR_MESSAGES.INVALID_PHONE_NUMBER;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (email.length > 0 && !emailRegex.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }
  return null;
};

export const validatePassengerType = (passengerType: string): string | null => {
  if (!passengerType) {
    return ERROR_MESSAGES.PASSENGER_TYPE_REQUIRED;
  }
  return null;
};

export const validateIdentityType = (identityType: string): string | null => {
  if (!identityType) {
    return ERROR_MESSAGES.ID_TYPE_REQUIRED;
  }
  return null;
};
