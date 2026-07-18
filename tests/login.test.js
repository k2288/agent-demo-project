const fs = require('fs');
const path = require('path');
const { initLoginForm } = require('../src/login');

function loadLoginPageBody() {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/);
  document.body.innerHTML = bodyMatch[1];
}

describe('login form', () => {
  beforeEach(() => {
    loadLoginPageBody();
    initLoginForm(document);
  });

  function submitForm() {
    const form = document.getElementById('login-form');
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }

  test('shows errors and does not report success for invalid input', () => {
    document.getElementById('username').value = '';
    document.getElementById('password').value = 'short';

    submitForm();

    expect(document.getElementById('username-error').textContent).toMatch(/required/i);
    expect(document.getElementById('password-error').textContent).toMatch(/at least/i);
    expect(document.getElementById('form-status').textContent).toMatch(/fix the errors/i);
  });

  test('clears previous errors and reports success for valid input', () => {
    document.getElementById('username').value = 'bad user!';
    document.getElementById('password').value = 'short';
    submitForm();
    expect(document.getElementById('username-error').textContent).not.toBe('');

    document.getElementById('username').value = 'john_doe';
    document.getElementById('password').value = 'abcd1234';
    submitForm();

    expect(document.getElementById('username-error').textContent).toBe('');
    expect(document.getElementById('password-error').textContent).toBe('');
    expect(document.getElementById('form-status').textContent).toMatch(/successful/i);
  });

  test('marks invalid fields with aria-invalid', () => {
    document.getElementById('username').value = '';
    document.getElementById('password').value = 'abcd1234';
    submitForm();

    expect(document.getElementById('username').getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById('password').hasAttribute('aria-invalid')).toBe(false);
  });
});
