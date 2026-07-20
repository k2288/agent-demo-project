var validateLoginForm;
if (typeof require === 'function') {
  validateLoginForm = require('./validation').validateLoginForm;
}

var DEFAULT_API_BASE_URL = 'http://localhost:3001';

function initLoginForm(doc, options) {
  doc = doc || document;
  options = options || {};

  var form = doc.getElementById('login-form');
  if (!form) {
    return null;
  }

  var win = options.window || doc.defaultView || (typeof window !== 'undefined' ? window : undefined);
  var fetchFn = options.fetch || (win && win.fetch) || (typeof fetch !== 'undefined' ? fetch : undefined);
  var apiBaseUrl = options.apiBaseUrl || (win && win.API_BASE_URL) || DEFAULT_API_BASE_URL;

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

  function setStatus(message) {
    if (formStatus) {
      formStatus.textContent = message;
    }
  }

  function submitLogin(username, password) {
    return fetchFn(apiBaseUrl + '/api/login', {
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
          setStatus('Login successful.');
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
          setStatus((result.data && result.data.message) || 'Login failed.');
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

    var result = validateLoginForm({ username: username, password: password });

    showFieldError(usernameError, usernameInput, result.errors.username);
    showFieldError(passwordError, passwordInput, result.errors.password);

    if (!result.valid) {
      setStatus('Please fix the errors above.');
      return result.valid;
    }

    setStatus('Logging in...');
    submitLogin(username, password);

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
