// backend/src/utils/validators.js

const provinceCodes = {
  11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
  21: "辽宁", 22: "吉林", 23: "黑龙江",
  31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东",
  41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南",
  50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏",
  61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆",
  71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
};

function isValidIdentityNumber(idNumber) {
  if (!idNumber || typeof idNumber !== 'string') return false;
  
  // Basic format check: 18 chars, first 17 digits, last digit or X
  if (!/^\d{17}[\dXx]$/.test(idNumber)) return false;

  // 1. Province Code Check
  const provinceCode = idNumber.substring(0, 2);
  if (!provinceCodes[provinceCode]) return false;

  // 2. Date Check
  const year = parseInt(idNumber.substring(6, 10), 10);
  const month = parseInt(idNumber.substring(10, 12), 10);
  const day = parseInt(idNumber.substring(12, 14), 10);

  const currentYear = new Date().getFullYear();
  if (year > currentYear || year < currentYear - 130) return false;
  if (month < 1 || month > 12) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return false;

  // 3. Checksum Check
  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const parityBit = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idNumber[i], 10) * factors[i];
  }
  
  const mod = sum % 11;
  const expectedLastChar = parityBit[mod];
  const actualLastChar = idNumber[17].toUpperCase();

  return expectedLastChar === actualLastChar;
}

function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{5,29}$/;
  return usernameRegex.test(username);
}

function isValidPhone(phone) {
  return /^\d{11}$/.test(phone || '');
}

function generateSixDigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

module.exports = {
  isValidUsername,
  isValidPhone,
  isValidIdentityNumber,
  generateSixDigitCode,
};
