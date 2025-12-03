// backend/src/utils/validators.js

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
  generateSixDigitCode,
};
