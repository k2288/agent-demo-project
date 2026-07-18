import { validateLoginForm } from './validation.js';

function showError(fieldName, message) {
  const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  const inputEl = document.querySelector(`[name="${fieldName}"]`);
  if (errorEl) {
    errorEl.textContent = message ?? '';
  }
  if (inputEl) {
    inputEl.setAttribute('aria-invalid', message ? 'true' : 'false');
  }
}

export function handleLoginSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const username = form.elements.username.value;
  const password = form.elements.password.value;

  const errors = validateLoginForm({ username, password });
  showError('username', errors.username);
  showError('password', errors.password);

  const isValid = !errors.username && !errors.password;
  const statusEl = document.querySelector('[data-form-status]');
  if (statusEl) {
    statusEl.textContent = isValid ? 'Login successful.' : '';
  }

  return isValid;
}

function init() {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', handleLoginSubmit);
  }
}

document.addEventListener('DOMContentLoaded', init);
