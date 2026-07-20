const fs = require('fs');
const path = require('path');
const { initDashboard } = require('../src/dashboard');

function loadDashboardPageBody() {
  const html = fs.readFileSync(path.join(__dirname, '../dashboard.html'), 'utf8');
  const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/);
  document.body.innerHTML = bodyMatch[1];
}

function makeFakeWindow(initialUsername) {
  const store = {};
  if (initialUsername) {
    store.username = initialUsername;
  }
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

describe('dashboard page', () => {
  beforeEach(() => {
    loadDashboardPageBody();
  });

  test('shows a welcome message for the logged-in user', () => {
    const fakeWindow = makeFakeWindow('john_doe');

    initDashboard(document, { window: fakeWindow });

    expect(document.getElementById('welcome-message').textContent).toBe('Welcome, john_doe!');
  });

  test('redirects to the login page when no session is present', () => {
    const fakeWindow = makeFakeWindow();

    initDashboard(document, { window: fakeWindow });

    expect(fakeWindow.location.href).toBe('index.html');
  });

  test('clears the session and redirects to login on logout', () => {
    const fakeWindow = makeFakeWindow('john_doe');

    initDashboard(document, { window: fakeWindow });
    document.getElementById('logout-button').dispatchEvent(new Event('click', { bubbles: true }));

    expect(fakeWindow.sessionStorage.getItem('username')).toBeNull();
    expect(fakeWindow.location.href).toBe('index.html');
  });
});
