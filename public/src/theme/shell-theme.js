
const key = 'iqchat-theme';
const stored = (() => {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
})();
const theme = (() => {
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)');
  if (prefersDark?.matches) {
    return 'dark';
  }
  return 'light';
})();
document.documentElement.setAttribute('data-theme', theme);
