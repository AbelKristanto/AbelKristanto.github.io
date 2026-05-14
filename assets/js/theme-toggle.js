/**
 * Theme Toggle Handler
 * 
 * Loaded before </body>. Handles:
 * - Click toggle between light/dark themes
 * - Persists preference to localStorage under key 'site-theme'
 * - Listens for system prefers-color-scheme changes when no stored preference exists
 * - Gracefully handles localStorage unavailability (private browsing)
 */
document.addEventListener('DOMContentLoaded', function() {
  var STORAGE_KEY = 'site-theme';
  var toggle = document.getElementById('theme-toggle');

  /**
   * Safely read from localStorage.
   * Returns null if unavailable or on error.
   */
  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  /**
   * Safely write to localStorage.
   * Silently fails if unavailable.
   */
  function setStoredTheme(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      // localStorage unavailable — preference won't persist but toggle still works
    }
  }

  // Toggle handler: click switches between light and dark
  if (toggle) {
    toggle.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      setStoredTheme(next);
    });
  }

  // Listen for system preference changes when no stored preference exists
  if (window.matchMedia) {
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function handleSystemThemeChange(e) {
      // Only respond to system changes if user hasn't explicitly chosen a theme
      if (!getStoredTheme()) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    }

    // Use addEventListener if available, otherwise addListener for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }
});
