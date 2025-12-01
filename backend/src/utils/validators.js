// backend/src/utils/validators.js

function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{5,29}$/;
  return usernameRegex.test(username);
}

module.exports = {
  isValidUsername,
};
