var USERNAME_MIN_LENGTH = 3;
var USERNAME_MAX_LENGTH = 20;
var USERNAME_PATTERN = /^[a-zA-Z0-9_.-]+$/;
var PASSWORD_MIN_LENGTH = 8;

function validateUsername(username) {
  var value = typeof username === 'string' ? username.trim() : '';

  if (!value) {
    return 'Username is required.';
  }
  if (value.length < USERNAME_MIN_LENGTH) {
    return 'Username must be at least ' + USERNAME_MIN_LENGTH + ' characters.';
  }
  if (value.length > USERNAME_MAX_LENGTH) {
    return 'Username must be at most ' + USERNAME_MAX_LENGTH + ' characters.';
  }
  if (!USERNAME_PATTERN.test(value)) {
    return 'Username may only contain letters, numbers, underscores, dots, and hyphens.';
  }
  return null;
}

function validatePassword(password) {
  var value = typeof password === 'string' ? password : '';

  if (!value) {
    return 'Password is required.';
  }
  if (value.length < PASSWORD_MIN_LENGTH) {
    return 'Password must be at least ' + PASSWORD_MIN_LENGTH + ' characters.';
  }
  if (!/[a-zA-Z]/.test(value)) {
    return 'Password must contain at least one letter.';
  }
  if (!/[0-9]/.test(value)) {
    return 'Password must contain at least one number.';
  }
  return null;
}

function validateLoginForm(fields) {
  fields = fields || {};
  var errors = {};

  var usernameError = validateUsername(fields.username);
  if (usernameError) {
    errors.username = usernameError;
  }

  var passwordError = validatePassword(fields.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: errors
  };
}

function validateConfirmPassword(password, confirmPassword) {
  var value = typeof confirmPassword === 'string' ? confirmPassword : '';

  if (!value) {
    return 'Please confirm your password.';
  }
  if (value !== password) {
    return 'Passwords do not match.';
  }
  return null;
}

function validateRegisterForm(fields) {
  fields = fields || {};
  var errors = {};

  var usernameError = validateUsername(fields.username);
  if (usernameError) {
    errors.username = usernameError;
  }

  var passwordError = validatePassword(fields.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  var confirmPasswordError = validateConfirmPassword(fields.password, fields.confirmPassword);
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: errors
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateUsername: validateUsername,
    validatePassword: validatePassword,
    validateConfirmPassword: validateConfirmPassword,
    validateLoginForm: validateLoginForm,
    validateRegisterForm: validateRegisterForm,
    USERNAME_MIN_LENGTH: USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH: USERNAME_MAX_LENGTH,
    PASSWORD_MIN_LENGTH: PASSWORD_MIN_LENGTH
  };
}
