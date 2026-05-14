/**
 * Theme Initialization Script (FOUC Prevention)
 * 
 * This script MUST be inlined in <head> to prevent Flash of Unstyled Content.
 * It reads the user's stored theme preference or system preference and sets
 * the data-theme attribute on <html> before the first paint.
 */
(function() {
  var STORAGE_KEY = 'site-theme';
  var theme = 'light'; // default fallback

  // Try to read stored preference from localStorage
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    } else {
      // No valid stored preference — use system preference
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
  } catch (e) {
    // localStorage unavailable (private browsing, storage disabled, etc.)
    // Fall back to system preference
    try {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    } catch (e2) {
      // matchMedia also unavailable — keep default 'light'
    }
  }

  document.documentElement.setAttribute('data-theme', theme);
})();
