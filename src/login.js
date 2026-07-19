var validateLoginForm;
if (typeof require === 'function') {
  validateLoginForm = require('./validation').validateLoginForm;
}

function initLoginForm(doc) {
  doc = doc || document;

  var form = doc.getElementById('login-form');
  if (!form) {
    return null;
  }

  var usernameInput = doc.getElementById('username');
  var passwordInput = doc.getElementById('password');
  var usernameError = doc.getElementById('username-error');
  var passwordError = doc.getElementById('password-error');
  var formStatus = doc.getElementById('form-status');

  function showFieldError(errorEl, inputEl, message) {
    if (errorEl) {
      errorEl.textContent = message || '';
    }
    if (inputEl) {
      if (message) {
        inputEl.setAttribute('aria-invalid', 'true');
      } else {
        inputEl.removeAttribute('aria-invalid');
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    var result = validateLoginForm({
      username: usernameInput ? usernameInput.value : '',
      password: passwordInput ? passwordInput.value : ''
    });

    showFieldError(usernameError, usernameInput, result.errors.username);
    showFieldError(passwordError, passwordInput, result.errors.password);

    if (formStatus) {
      formStatus.textContent = result.valid ? 'Login successful.' : 'Please fix the errors above.';
    }

    return result.valid;
  }

  form.addEventListener('submit', handleSubmit);

  return {
    handleSubmit: handleSubmit
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initLoginForm: initLoginForm };
} else {
  document.addEventListener('DOMContentLoaded', function () {
    initLoginForm(document);
  });
}
