(function () {
  const form = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const usernameError = document.getElementById("username-error");
  const passwordError = document.getElementById("password-error");
  const formError = document.getElementById("form-error");

  function setFieldError(input, errorEl, message) {
    errorEl.textContent = message || "";
    input.classList.toggle("invalid", Boolean(message));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    formError.textContent = "";

    const { username, password } = LoginValidation.validateLoginForm({
      username: usernameInput.value,
      password: passwordInput.value,
    });

    setFieldError(usernameInput, usernameError, username);
    setFieldError(passwordInput, passwordError, password);

    if (username || password) {
      formError.textContent = "Please fix the errors above.";
      return;
    }

    form.dispatchEvent(new CustomEvent("login:success", {
      detail: { username: usernameInput.value },
    }));
  });
})();
