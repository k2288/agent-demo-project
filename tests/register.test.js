const fs = require('fs');
const path = require('path');
const { initRegisterForm } = require('../src/register');

function loadRegisterPageBody() {
  const html = fs.readFileSync(path.join(__dirname, '../register.html'), 'utf8');
  const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/);
  document.body.innerHTML = bodyMatch[1];
}

function flushPromises() {
  return Promise.resolve().then(() => Promise.resolve()).then(() => Promise.resolve());
}

function makeFakeWindow() {
  const store = {};
  return {
    location: { href: '' },
    sessionStorage: {
      setItem: (key, value) => {
        store[key] = value;
      },
      getItem: (key) => (key in store ? store[key] : null),
      removeItem: (key) => {
        delete store[key];
      }
    }
  };
}

function jsonResponse(status, body) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body)
  });
}

describe('register form', () => {
  let fakeWindow;
  let fetchMock;

  beforeEach(() => {
    loadRegisterPageBody();
    fakeWindow = makeFakeWindow();
    fetchMock = jest.fn();
    initRegisterForm(document, { window: fakeWindow, fetch: fetchMock });
  });

  function submitForm() {
    const form = document.getElementById('register-form');
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }

  test('shows errors and does not report success for invalid input', () => {
    document.getElementById('username').value = '';
    document.getElementById('password').value = 'short';
    document.getElementById('confirm-password').value = '';

    submitForm();

    expect(document.getElementById('username-error').textContent).toMatch(/required/i);
    expect(document.getElementById('password-error').textContent).toMatch(/at least/i);
    expect(document.getElementById('confirm-password-error').textContent).toMatch(/confirm/i);
    expect(document.getElementById('form-status').textContent).toMatch(/fix the errors/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('shows an error when passwords do not match', () => {
    document.getElementById('username').value = 'john_doe';
    document.getElementById('password').value = 'abcd1234';
    document.getElementById('confirm-password').value = 'abcd9999';

    submitForm();

    expect(document.getElementById('confirm-password-error').textContent).toMatch(/do not match/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('marks invalid fields with aria-invalid', () => {
    document.getElementById('username').value = '';
    document.getElementById('password').value = 'abcd1234';
    document.getElementById('confirm-password').value = 'abcd1234';
    submitForm();

    expect(document.getElementById('username').getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById('password').hasAttribute('aria-invalid')).toBe(false);
  });

  test('calls the backend register API for valid input', () => {
    fetchMock.mockReturnValue(jsonResponse(201, { token: 't', user: { username: 'john_doe' } }));

    document.getElementById('username').value = 'john_doe';
    document.getElementById('password').value = 'abcd1234';
    document.getElementById('confirm-password').value = 'abcd1234';
    submitForm();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/register'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'john_doe', password: 'abcd1234' })
      })
    );
    expect(document.getElementById('form-status').textContent).toMatch(/creating your account/i);
  });

  test('stores the session and redirects to the dashboard on success', async () => {
    fetchMock.mockReturnValue(jsonResponse(201, { token: 'the-token', user: { username: 'john_doe' } }));

    document.getElementById('username').value = 'john_doe';
    document.getElementById('password').value = 'abcd1234';
    document.getElementById('confirm-password').value = 'abcd1234';
    submitForm();

    await flushPromises();

    expect(fakeWindow.sessionStorage.getItem('username')).toBe('john_doe');
    expect(fakeWindow.sessionStorage.getItem('token')).toBe('the-token');
    expect(fakeWindow.location.href).toBe('dashboard.html');
    expect(document.getElementById('form-status').textContent).toMatch(/successful/i);
  });

  test('shows a conflict message when the username is already taken', async () => {
    fetchMock.mockReturnValue(jsonResponse(409, { message: 'Username is already taken.' }));

    document.getElementById('username').value = 'john_doe';
    document.getElementById('password').value = 'abcd1234';
    document.getElementById('confirm-password').value = 'abcd1234';
    submitForm();

    await flushPromises();

    expect(document.getElementById('form-status').textContent).toMatch(/already taken/i);
    expect(fakeWindow.location.href).toBe('');
  });

  test('shows a network error message when the request fails', async () => {
    fetchMock.mockReturnValue(Promise.reject(new Error('network down')));

    document.getElementById('username').value = 'john_doe';
    document.getElementById('password').value = 'abcd1234';
    document.getElementById('confirm-password').value = 'abcd1234';
    submitForm();

    await flushPromises();

    expect(document.getElementById('form-status').textContent).toMatch(/unable to reach the server/i);
  });
});
