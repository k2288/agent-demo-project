(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.LoginValidation = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const MIN_PASSWORD_LENGTH = 8;

  function validateUsername(username) {
    if (!username || !username.trim()) {
      return "Username is required.";
    }
    if (username.trim().length < 3) {
      return "Username must be at least 3 characters.";
    }
    return null;
  }

  function validatePassword(password) {
    if (!password) {
      return "Password is required.";
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    return null;
  }

  function validateLoginForm({ username, password }) {
    return {
      username: validateUsername(username),
      password: validatePassword(password),
    };
  }

  return { validateUsername, validatePassword, validateLoginForm, MIN_PASSWORD_LENGTH };
});
