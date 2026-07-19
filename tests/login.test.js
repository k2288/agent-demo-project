const fs = require('fs');
const path = require('path');
const { initLoginForm } = require('../src/login');

function loadLoginPageBody() {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
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

describe('login form', () => {
  let fakeWindow;
  let fetchMock;

  beforeEach(() => {
    loadLoginPageBody();
    fakeWindow = makeFakeWindow();
    fetchMock = jest.fn();
    initLoginForm(document, { window: fakeWindow, fetch: fetchMock });
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
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('marks invalid fields with aria-invalid', () => {
    document.getElementById('username').value = '';
    document.getElementById('password').value = 'abcd1234';
    submitForm();

    expect(document.getElementById('username').getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById('password').hasAttribute('aria-invalid')).toBe(false);
  });

  test('calls the backend login API for valid input', () => {
    fetchMock.mockReturnValue(jsonResponse(200, { token: 't', user: { username: 'john_doe' } }));

    document.getElementById('username').value = 'john_doe';
    document.getElementById('password').value = 'abcd1234';
    submitForm();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'john_doe', password: 'abcd1234' })
      })
    );
    expect(document.getElementById('form-status').textContent).toMatch(/logging in/i);
  });

  test('stores the session and redirects to the dashboard on success', async () => {
    fetchMock.mockReturnValue(jsonResponse(200, { token: 'the-token', user: { username: 'john_doe' } }));

    document.getElementById('username').value = 'john_doe';
    document.getElementById('password').value = 'abcd1234';
    submitForm();

    await flushPromises();

    expect(fakeWindow.sessionStorage.getItem('username')).toBe('john_doe');
    expect(fakeWindow.sessionStorage.getItem('token')).toBe('the-token');
    expect(fakeWindow.location.href).toBe('dashboard.html');
    expect(document.getElementById('form-status').textContent).toMatch(/successful/i);
  });

  test('shows an invalid credentials message on a 401 response', async () => {
    fetchMock.mockReturnValue(jsonResponse(401, { message: 'Invalid username or password.' }));

    document.getElementById('username').value = 'john_doe';
    document.getElementById('password').value = 'abcd1234';
    submitForm();

    await flushPromises();

    expect(document.getElementById('form-status').textContent).toMatch(/invalid username or password/i);
    expect(fakeWindow.location.href).toBe('');
  });

  test('shows a network error message when the request fails', async () => {
    fetchMock.mockReturnValue(Promise.reject(new Error('network down')));

    document.getElementById('username').value = 'john_doe';
    document.getElementById('password').value = 'abcd1234';
    submitForm();

    await flushPromises();

    expect(document.getElementById('form-status').textContent).toMatch(/unable to reach the server/i);
  });
});
