(function () {
  const { validateForm } = window.loginValidation;

  const form = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const usernameError = document.getElementById("username-error");
  const passwordError = document.getElementById("password-error");
  const formError = document.getElementById("form-error");
  const formSuccess = document.getElementById("form-success");

  function setFieldError(input, errorEl, message) {
    input.classList.toggle("invalid", Boolean(message));
    errorEl.textContent = message || "";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    formError.textContent = "";
    formSuccess.textContent = "";

    const errors = validateForm({
      username: usernameInput.value,
      password: passwordInput.value,
    });

    setFieldError(usernameInput, usernameError, errors.username);
    setFieldError(passwordInput, passwordError, errors.password);

    if (errors.username || errors.password) {
      formError.textContent = "Please fix the errors above.";
      return;
    }

    formSuccess.textContent = "Login successful.";
    form.reset();
  });
})();
