var validateRegisterForm;
if (typeof require === 'function') {
  validateRegisterForm = require('./validation').validateRegisterForm;
}

var DEFAULT_API_BASE_URL = 'http://localhost:3001';

function initRegisterForm(doc, options) {
  doc = doc || document;
  options = options || {};

  var form = doc.getElementById('register-form');
  if (!form) {
    return null;
  }

  var win = options.window || doc.defaultView || (typeof window !== 'undefined' ? window : undefined);
  var fetchFn = options.fetch || (win && win.fetch) || (typeof fetch !== 'undefined' ? fetch : undefined);
  var apiBaseUrl = options.apiBaseUrl || (win && win.API_BASE_URL) || DEFAULT_API_BASE_URL;

  var usernameInput = doc.getElementById('username');
  var passwordInput = doc.getElementById('password');
  var confirmPasswordInput = doc.getElementById('confirm-password');
  var usernameError = doc.getElementById('username-error');
  var passwordError = doc.getElementById('password-error');
  var confirmPasswordError = doc.getElementById('confirm-password-error');
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

  function setStatus(message) {
    if (formStatus) {
      formStatus.textContent = message;
    }
  }

  function submitRegistration(username, password) {
    return fetchFn(apiBaseUrl + '/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok) {
          if (win && win.sessionStorage) {
            win.sessionStorage.setItem('username', result.data.user.username);
            win.sessionStorage.setItem('token', result.data.token);
          }
          setStatus('Registration successful.');
          if (win) {
            win.location.href = 'dashboard.html';
          }
          return;
        }

        if (result.data && result.data.errors) {
          showFieldError(usernameError, usernameInput, result.data.errors.username);
          showFieldError(passwordError, passwordInput, result.data.errors.password);
          setStatus('Please fix the errors above.');
        } else {
          setStatus((result.data && result.data.message) || 'Registration failed.');
        }
      })
      .catch(function () {
        setStatus('Unable to reach the server. Please try again later.');
      });
  }

  function handleSubmit(event) {
    event.preventDefault();

    var username = usernameInput ? usernameInput.value : '';
    var password = passwordInput ? passwordInput.value : '';
    var confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

    var result = validateRegisterForm({
      username: username,
      password: password,
      confirmPassword: confirmPassword
    });

    showFieldError(usernameError, usernameInput, result.errors.username);
    showFieldError(passwordError, passwordInput, result.errors.password);
    showFieldError(confirmPasswordError, confirmPasswordInput, result.errors.confirmPassword);

    if (!result.valid) {
      setStatus('Please fix the errors above.');
      return result.valid;
    }

    setStatus('Creating your account...');
    submitRegistration(username, password);

    return result.valid;
  }

  form.addEventListener('submit', handleSubmit);

  return {
    handleSubmit: handleSubmit
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initRegisterForm: initRegisterForm };
} else {
  document.addEventListener('DOMContentLoaded', function () {
    initRegisterForm(document);
  });
}
