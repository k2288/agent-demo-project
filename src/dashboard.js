function initDashboard(doc, options) {
  doc = doc || document;
  options = options || {};

  var win = options.window || doc.defaultView || (typeof window !== 'undefined' ? window : undefined);
  var storage = win && win.sessionStorage;

  var welcomeMessage = doc.getElementById('welcome-message');
  var logoutButton = doc.getElementById('logout-button');

  var username = storage ? storage.getItem('username') : null;

  if (!username) {
    if (win) {
      win.location.href = 'index.html';
    }
    return null;
  }

  if (welcomeMessage) {
    welcomeMessage.textContent = 'Welcome, ' + username + '!';
  }

  function handleLogout() {
    if (storage) {
      storage.removeItem('username');
      storage.removeItem('token');
    }
    if (win) {
      win.location.href = 'index.html';
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }

  return {
    handleLogout: handleLogout
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initDashboard: initDashboard };
} else {
  document.addEventListener('DOMContentLoaded', function () {
    initDashboard(document);
  });
}
