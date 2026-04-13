const THEME_KEY = 'iqchat-theme';

const getTheme = () =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

const syncToggle = (btn) => {
  const dark = getTheme() === 'dark';
  btn.classList.toggle('theme-toggle--dark', dark);
};

const setTheme = (theme) => {
  if (theme !== 'dark' && theme !== 'light') {
    return;
  }
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (_) {
    /* ignore */
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(syncToggle);
};

const init = () => {
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    syncToggle(btn);
    btn.addEventListener('click', () => {
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
