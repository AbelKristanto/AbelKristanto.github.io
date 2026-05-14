/**
 * Embed Loader
 * Handles lazy-loading of iframe embeds with timeout fallback.
 * Finds all .embed-container elements, sets iframe src from data-src,
 * and manages loading states (spinner, fade-in, fallback on error/timeout).
 * Also handles fullscreen toggle for embed containers.
 */
document.addEventListener('DOMContentLoaded', function() {
  var TIMEOUT_MS = 10000;

  document.querySelectorAll('.embed-container').forEach(function(container) {
    var iframe = container.querySelector('.embed-container__iframe');
    var loader = container.querySelector('.embed-container__loader');
    var fallback = container.querySelector('.embed-container__fallback');
    var fullscreenBtn = container.querySelector('.embed-container__fullscreen-toggle');
    var src = iframe.getAttribute('data-src');

    if (!src) return;

    // Set src to begin loading
    iframe.src = src;

    // Timeout fallback — if iframe hasn't loaded within 10 seconds,
    // hide iframe and spinner, show fallback with direct link
    var timer = setTimeout(function() {
      iframe.style.display = 'none';
      if (loader) {
        loader.style.display = 'none';
      }
      if (fallback) {
        fallback.hidden = false;
      }
    }, TIMEOUT_MS);

    // On successful load: clear timeout, hide spinner, fade in iframe
    iframe.addEventListener('load', function() {
      clearTimeout(timer);
      if (loader) {
        loader.style.display = 'none';
      }
      iframe.style.opacity = '1';
    });

    // On error: show fallback immediately
    iframe.addEventListener('error', function() {
      clearTimeout(timer);
      iframe.style.display = 'none';
      if (loader) {
        loader.style.display = 'none';
      }
      if (fallback) {
        fallback.hidden = false;
      }
    });

    // Fullscreen toggle — keyboard accessible (Enter/Space activate)
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', function() {
        container.classList.toggle('embed-container--fullscreen');
      });

      fullscreenBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          container.classList.toggle('embed-container--fullscreen');
        }
      });
    }
  });

  // Allow Escape key to exit fullscreen from anywhere on the page
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var fullscreenContainer = document.querySelector('.embed-container--fullscreen');
      if (fullscreenContainer) {
        fullscreenContainer.classList.remove('embed-container--fullscreen');
      }
    }
  });
});
