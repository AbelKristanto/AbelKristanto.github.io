/**
 * Scroll Reveal — Intersection Observer-based reveal animations
 *
 * Applies fade-in + upward translate to content sections as they enter
 * the viewport. Respects prefers-reduced-motion by immediately showing
 * all elements without animation.
 *
 * CSS classes used:
 *   .reveal-on-scroll — initial hidden state (opacity 0, translateY 20px)
 *   .is-visible       — revealed state (opacity 1, translateY 0)
 *   --reveal-delay    — per-element stagger delay (capped at 240ms)
 */
(function() {
  var THRESHOLD = 0.2;
  var ROOT_MARGIN = '0px 0px -10% 0px';
  var SELECTORS = [
    '.home-section', '.content > h2', '.content > h3',
    '.content > p', '.content > ul', '.content > ol',
    '.section-card', '.project-card', '.embed-container'
  ];

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function init() {
    var elements = document.querySelectorAll(SELECTORS.join(','));

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      elements.forEach(function(el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: THRESHOLD, rootMargin: ROOT_MARGIN });

    elements.forEach(function(el, i) {
      el.classList.add('reveal-on-scroll');
      el.style.setProperty('--reveal-delay', Math.min(i * 60, 240) + 'ms');
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
