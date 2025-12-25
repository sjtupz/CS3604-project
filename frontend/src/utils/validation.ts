// frontend/src/utils/validation.ts
import { ERROR_MESSAGES, USERNAME_UNIFIED_ERROR, LIMITS, PATTERNS } from '../constants/registerForm';

export const validateUsername = (username: string): string | null => {
  if (!/^[a-zA-Z]/.test(username)) {
    return ERROR_MESSAGES.USERNAME_INVALID_START;
  }
  if (!/^[a-zA-Z0-9_]*$/.test(username)) {
    return USERNAME_UNIFIED_ERROR;
  }
  if (username.length > LIMITS.MAX_USERNAME_LENGTH) {
    return USERNAME_UNIFIED_ERROR;
  }
  if (username.length < 6) {
    return ERROR_MESSAGES.USERNAME_TOO_SHORT;
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length > 0 && password.length < 6) {
    return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  }
  if (password.length > 0) {
    if (/[^a-zA-Z0-9_]/.test(password)) {
      return ERROR_MESSAGES.PASSWORD_WEAK;
    }
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasUnderscore = /_/.test(password);
    if (!((hasLetters && hasNumbers) || (hasLetters && hasUnderscore) || (hasNumbers && hasUnderscore))) {
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
  if (fullName.length > 0 && !PATTERNS.FULL_NAME.test(fullName)) {
    return ERROR_MESSAGES.FULL_NAME_INVALID;
  }
  return null;
};

const provinceCodes: { [key: string]: string } = {
  11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
  21: "辽宁", 22: "吉林", 23: "黑龙江",
  31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东",
  41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南",
  50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏",
  61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆",
  71: "台湾",
  81: "香港", 82: "澳门",
  91: "国外"
};

export const validateIdentityNumber = (identityNumber: string): string | null => {
  if (identityNumber.length === 0) return null;
  if (identityNumber.length < 18) {
    return ERROR_MESSAGES.ID_NUMBER_TOO_SHORT;
  }
  
  if (!PATTERNS.IDENTITY_NUMBER.test(identityNumber)) {
    return ERROR_MESSAGES.ID_NUMBER_INVALID_FORMAT;
  }

  // Province validation
  const provinceCode = identityNumber.substring(0, 2);
  if (!provinceCodes[provinceCode]) {
    return ERROR_MESSAGES.ID_NUMBER_INVALID_FORMAT;
  }

  // Date validation
  const year = parseInt(identityNumber.substring(6, 10), 10);
  const month = parseInt(identityNumber.substring(10, 12), 10);
  const day = parseInt(identityNumber.substring(12, 14), 10);
  const currentYear = new Date().getFullYear();

  if (year > currentYear || year < currentYear - 130) return ERROR_MESSAGES.ID_NUMBER_INVALID_FORMAT;
  if (month < 1 || month > 12) return ERROR_MESSAGES.ID_NUMBER_INVALID_FORMAT;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return ERROR_MESSAGES.ID_NUMBER_INVALID_FORMAT;

  // Checksum validation
  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const parityBit = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(identityNumber[i], 10) * factors[i];
  }
  
  const mod = sum % 11;
  const expectedLastChar = parityBit[mod];
  const actualLastChar = identityNumber[17].toUpperCase();
  
  if (expectedLastChar !== actualLastChar) {
    return ERROR_MESSAGES.ID_NUMBER_INVALID_FORMAT;
  }

  return null;
};

export const validatePhoneNumber = (phoneNumber: string): string | null => {
  const phoneRegex = /^1[3-9]\d{9}$/;
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
