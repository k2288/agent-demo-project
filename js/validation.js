(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.loginValidation = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const USERNAME_MIN_LENGTH = 3;
  const USERNAME_MAX_LENGTH = 30;
  const USERNAME_PATTERN = /^[a-zA-Z0-9_.]+$/;
  const PASSWORD_MIN_LENGTH = 8;

  function validateUsername(username) {
    const value = (username || "").trim();

    if (!value) {
      return "Username is required.";
    }
    if (value.length < USERNAME_MIN_LENGTH) {
      return `Username must be at least ${USERNAME_MIN_LENGTH} characters.`;
    }
    if (value.length > USERNAME_MAX_LENGTH) {
      return `Username must be at most ${USERNAME_MAX_LENGTH} characters.`;
    }
    if (!USERNAME_PATTERN.test(value)) {
      return "Username may only contain letters, numbers, periods, and underscores.";
    }
    return null;
  }

  function validatePassword(password) {
    const value = password || "";

    if (!value) {
      return "Password is required.";
    }
    if (value.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    }
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
      return "Password must contain at least one letter and one number.";
    }
    return null;
  }

  function validateForm(fields) {
    return {
      username: validateUsername(fields.username),
      password: validatePassword(fields.password),
    };
  }

  return {
    validateUsername,
    validatePassword,
    validateForm,
  };
});
