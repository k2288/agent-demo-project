const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
const PASSWORD_MIN_LENGTH = 8;

export function validateUsername(username) {
  const value = (username ?? '').trim();

  if (value.length === 0) {
    return 'Username is required.';
  }
  if (value.length < USERNAME_MIN_LENGTH) {
    return `Username must be at least ${USERNAME_MIN_LENGTH} characters.`;
  }
  if (value.length > USERNAME_MAX_LENGTH) {
    return `Username must be no more than ${USERNAME_MAX_LENGTH} characters.`;
  }
  if (!USERNAME_PATTERN.test(value)) {
    return 'Username may only contain letters, numbers, and underscores.';
  }
  return null;
}

export function validatePassword(password) {
  const value = password ?? '';

  if (value.length === 0) {
    return 'Password is required.';
  }
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
}

export function validateLoginForm({ username, password }) {
  return {
    username: validateUsername(username),
    password: validatePassword(password),
  };
}
