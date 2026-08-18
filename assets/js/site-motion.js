/**
 * Site Motion Layer
 * -----------------
 * Orchestrates the third-party motion stack and the react-bits inspired
 * micro-interactions:
 *
 *   Lenis        — smooth scrolling, driven by the GSAP ticker
 *   GSAP + ScrollTrigger — hero timeline, scroll reveals, stat counters,
 *                  scroll progress bar
 *   Vanta NET (three.js) — animated hero background, lazy loaded and only on
 *                  pointer-capable large screens
 *
 * Progressive enhancement contract:
 *   - `html.motion-ready` is set by an inline head script and is the ONLY
 *     thing that hides content. If GSAP never loads, a failsafe removes it and
 *     the page renders as plain static HTML.
 *   - `html.motion-active` is set here once initialisation succeeded.
 *   - prefers-reduced-motion disables Lenis, Vanta and every tween.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;

  // No GSAP (offline, blocked CDN) → drop the hidden state, keep the site usable.
  if (!gsap) {
    root.classList.remove('motion-ready');
    initPointerEffects();
    initNavState();
    initBackToTop(null);
    initSkillBars();
    initArcade();
    initStartMenu();
    initDrawer();
    initPageTransitions();
    return;
  }

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  root.classList.add('motion-active');

  var lenis = initLenis();
  initHero();
  initReveals();
  initCounters();
  initScrollProgress();
  initPointerEffects();
  initNavState();
  initAnchorScroll(lenis);
  initBackToTop(lenis);
  initSkillBars();
  initArcade();
  initStartMenu();
  initDrawer();
  initPageTransitions();
  initVanta();

  // -------------------------------------------------------------------------
  // Lenis smooth scroll
  // -------------------------------------------------------------------------
  function initLenis() {
    if (reduceMotion || typeof window.Lenis === 'undefined') {
      return null;
    }

    var instance = new window.Lenis({
      duration: 1.05,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      touchMultiplier: 1.6
    });

    // Single rAF loop: GSAP's ticker drives Lenis, ScrollTrigger follows Lenis.
    instance.on('scroll', function () {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.update();
      }
    });

    gsap.ticker.add(function (time) {
      instance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Exposed so the mobile menu can lock/unlock scrolling.
    window.__lenis = instance;
    return instance;
  }

  // -------------------------------------------------------------------------
  // Hero intro timeline (react-bits SplitText port: word-by-word rise)
  // -------------------------------------------------------------------------
  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

    splitWords(hero.querySelectorAll('[data-split]'));

    var words = hero.querySelectorAll('.split-word');
    var rest = hero.querySelectorAll('[data-hero-stagger]');

    if (reduceMotion) {
      gsap.set(words, { opacity: 1, y: 0 });
      gsap.set(rest, { opacity: 1, y: 0 });
      return;
    }

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (words.length) {
      tl.to(words, { opacity: 1, y: 0, duration: 0.8, stagger: 0.035 });
    }

    if (rest.length) {
      tl.to(rest, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.45');
    }
  }

  /** Wraps each word of an element in `.split-word` spans, line by line. */
  function splitWords(elements) {
    Array.prototype.forEach.call(elements, function (element) {
      var text = element.textContent.trim();
      if (!text) {
        return;
      }

      var markup = text
        .split(/\s+/)
        .map(function (word) {
          return '<span class="split-word">' + escapeHtml(word) + ' </span>';
        })
        .join('');

      element.innerHTML = '<span class="split-line">' + markup + '</span>';
    });
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // -------------------------------------------------------------------------
  // Scroll reveals
  // -------------------------------------------------------------------------
  function initReveals() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) {
      return;
    }

    if (reduceMotion || !window.ScrollTrigger) {
      gsap.set(targets, { opacity: 1, x: 0, y: 0 });
      return;
    }

    // batch() groups elements that enter the viewport together, so grids
    // stagger as a unit instead of each card firing its own trigger.
    window.ScrollTrigger.batch(targets, {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          stagger: 0.08,
          onStart: function () {
            batch.forEach(function (element) {
              element.classList.add('is-revealed');
            });
          }
        });
      }
    });
  }

  // -------------------------------------------------------------------------
  // Stat counters (react-bits CountUp port)
  // -------------------------------------------------------------------------
  function initCounters() {
    var counters = document.querySelectorAll('[data-count-to]');

    Array.prototype.forEach.call(counters, function (element) {
      var target = parseFloat(element.getAttribute('data-count-to'));
      var suffix = element.getAttribute('data-count-suffix') || '';

      if (isNaN(target)) {
        return;
      }

      if (reduceMotion) {
        element.textContent = formatNumber(target) + suffix;
        return;
      }

      var state = { value: 0 };
      element.textContent = '0' + suffix;

      // IntersectionObserver rather than ScrollTrigger: a deep-linked or
      // restored scroll position can put the counter on screen before any
      // scroll event happens, and ScrollTrigger only fires on movement.
      var start = function () {
        gsap.to(state, {
          value: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: function () {
            element.textContent = formatNumber(Math.round(state.value)) + suffix;
          }
        });
      };

      if (!('IntersectionObserver' in window)) {
        start();
        return;
      }

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }
            observer.unobserve(entry.target);
            start();
          });
        },
        { threshold: 0.4 }
      );

      observer.observe(element);
    });
  }

  function formatNumber(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // -------------------------------------------------------------------------
  // Scroll progress bar
  // -------------------------------------------------------------------------
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress__bar');
    if (!bar || reduceMotion || !window.ScrollTrigger) {
      return;
    }

    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
  }

  // -------------------------------------------------------------------------
  // Pointer effects: spotlight cards + magnetic buttons
  // -------------------------------------------------------------------------
  function initPointerEffects() {
    var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (!finePointer || reduceMotion) {
      return;
    }

    document.querySelectorAll('.spotlight').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', event.clientX - rect.left + 'px');
        card.style.setProperty('--my', event.clientY - rect.top + 'px');
      });
    });

    if (!window.gsap) {
      return;
    }

    document.querySelectorAll('[data-magnetic]').forEach(function (element) {
      var strength = parseFloat(element.getAttribute('data-magnetic')) || 0.25;

      element.addEventListener('pointermove', function (event) {
        var rect = element.getBoundingClientRect();
        window.gsap.to(element, {
          x: (event.clientX - rect.left - rect.width / 2) * strength,
          y: (event.clientY - rect.top - rect.height / 2) * strength,
          duration: 0.4,
          ease: 'power3.out'
        });
      });

      element.addEventListener('pointerleave', function () {
        window.gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  // -------------------------------------------------------------------------
  // Sticky nav state
  // -------------------------------------------------------------------------
  function initNavState() {
    var nav = document.querySelector('.minimalist-nav');
    if (!nav) {
      return;
    }

    var update = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 16);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // -------------------------------------------------------------------------
  // Anchor navigation (must go through Lenis, not native scrollIntoView)
  // -------------------------------------------------------------------------
  function initAnchorScroll(instance) {
    var navHeight = 84;

    document.querySelectorAll('a[href*="#"]').forEach(function (anchor) {
      var href = anchor.getAttribute('href');
      var hashIndex = href.indexOf('#');
      var hash = href.slice(hashIndex);

      if (hash.length < 2) {
        return;
      }

      // Only intercept links pointing at the current document.
      var path = href.slice(0, hashIndex);
      if (path && path !== window.location.pathname) {
        return;
      }

      anchor.addEventListener('click', function (event) {
        var target = document.querySelector(hash);
        if (!target) {
          return;
        }

        event.preventDefault();

        if (instance) {
          instance.scrollTo(target, { offset: -navHeight });
        } else {
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - navHeight,
            behavior: reduceMotion ? 'auto' : 'smooth'
          });
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // Back to top
  // -------------------------------------------------------------------------
  function initBackToTop(instance) {
    var button = document.querySelector('[data-back-to-top]');
    if (!button) {
      return;
    }

    var update = function () {
      button.classList.toggle('is-visible', window.scrollY > 600);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });

    button.addEventListener('click', function () {
      if (instance) {
        instance.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  // -------------------------------------------------------------------------
  // Vanta NET hero background (lazy: ~600KB of three.js, desktop only)
  // -------------------------------------------------------------------------
  function initVanta() {
    var mount = document.querySelector('[data-vanta]');
    var coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    var wideScreen = !window.matchMedia || window.matchMedia('(min-width: 900px)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;

    if (!mount || reduceMotion || coarsePointer || saveData || !wideScreen) {
      return;
    }

    loadScript('https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js', function () {
      loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.net.min.js', function () {
        if (!window.VANTA || !window.VANTA.NET) {
          return;
        }

        var effect = null;

        var build = function () {
          if (effect) {
            effect.destroy();
          }

          var styles = getComputedStyle(document.documentElement);
          var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

          effect = window.VANTA.NET({
            el: mount,
            mouseControls: true,
            touchControls: false,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1,
            scaleMobile: 1,
            backgroundAlpha: 0,
            color: parseColor(styles.getPropertyValue('--color-accent'), isDark ? 0x8b8bff : 0x4f46e5),
            points: 9,
            maxDistance: 22,
            spacing: 18,
            showDots: true
          });
        };

        build();

        // Rebuild with theme-matched colors when the user flips the theme.
        var observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.attributeName === 'data-theme') {
              build();
            }
          });
        });
        observer.observe(document.documentElement, { attributes: true });

        // Free the WebGL context when the hero is far off-screen.
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (!effect) {
                return;
              }
              if (entry.isIntersecting) {
                effect.resize();
              }
            });
          }).observe(mount);
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // Skill / XP bars
  // -------------------------------------------------------------------------
  // Each [data-xp] holds a 0-100 value. IntersectionObserver is used instead of
  // ScrollTrigger here because the bars can already be inside the viewport when
  // the page is deep-linked (#profile), and ScrollTrigger only fires its
  // callbacks on scroll movement, not on creation. Without JS, or with reduced
  // motion, the bar is painted at its final width immediately so the numbers
  // are never hidden behind an animation.
  function initSkillBars() {
    var bars = document.querySelectorAll('[data-xp]');
    if (!bars.length) {
      return;
    }

    var fill = function (bar) {
      var value = parseFloat(bar.getAttribute('data-xp'));
      if (isNaN(value)) {
        return;
      }
      bar.style.width = Math.max(0, Math.min(100, value)) + '%';
    };

    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(bars, function (bar) {
        bar.classList.add('is-filled');
        fill(bar);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          fill(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    Array.prototype.forEach.call(bars, function (bar) {
      observer.observe(bar);
    });
  }

  // -------------------------------------------------------------------------
  // Arcade extras: CRT scanline toggle + Konami code
  // -------------------------------------------------------------------------
  function initArcade() {
    var stored = null;
    try {
      stored = localStorage.getItem('site-crt');
    } catch (e) {
      /* storage blocked — CRT just stays off */
    }

    setCrt(stored === 'on');

    var toggle = document.querySelector('[data-crt-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function () {
        setCrt(root.getAttribute('data-crt') !== 'on');
      });
    }

    initKonami();
  }

  function setCrt(on) {
    root.setAttribute('data-crt', on ? 'on' : 'off');

    var toggle = document.querySelector('[data-crt-toggle]');
    if (toggle) {
      toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    try {
      localStorage.setItem('site-crt', on ? 'on' : 'off');
    } catch (e) {
      /* ignore */
    }
  }

  function initKonami() {
    var sequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    var index = 0;

    document.addEventListener('keydown', function (event) {
      var key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      index = key === sequence[index] ? index + 1 : (key === sequence[0] ? 1 : 0);

      if (index < sequence.length) {
        return;
      }

      index = 0;
      setCrt(true);
      showToast();
    });
  }

  function showToast() {
    var toast = document.querySelector('[data-arcade-toast]');
    if (!toast) {
      return;
    }

    toast.classList.add('is-open');
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(function () {
      toast.classList.remove('is-open');
    }, 3200);
  }

  // -------------------------------------------------------------------------
  // Start menu (home) — keyboard selection
  // -------------------------------------------------------------------------
  function initStartMenu() {
    var menu = document.querySelector('[data-start-menu]');
    if (!menu) {
      return;
    }

    var items = Array.prototype.slice.call(menu.querySelectorAll('[data-menu-item]'));
    if (!items.length) {
      return;
    }

    var index = 0;

    var select = function (next) {
      index = (next + items.length) % items.length;
      items.forEach(function (item, i) {
        item.classList.toggle('is-selected', i === index);
      });
      items[index].focus({ preventScroll: true });
    };

    items.forEach(function (item, i) {
      item.addEventListener('focus', function () {
        index = i;
        items.forEach(function (other, j) {
          other.classList.toggle('is-selected', j === i);
        });
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        select(index + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        select(index - 1);
      } else if (event.key === 'Enter' && document.activeElement === document.body) {
        // Enter only "starts the game" when focus is nowhere else on the page;
        // otherwise the browser's own activation behaviour wins.
        event.preventDefault();
        items[index].click();
      }
    });
  }

  // -------------------------------------------------------------------------
  // Navigation drawer
  // -------------------------------------------------------------------------
  // Lives here rather than in an inline <script> inside the include: the
  // compress_html layout strips newlines in production, which silently
  // truncates any inline script that contains a // comment.
  function initDrawer() {
    var hamburger = document.getElementById('mobile-menu-toggle');
    var panel = document.getElementById('mobile-nav-panel');
    var overlay = document.getElementById('mobile-nav-overlay');

    if (!hamburger || !panel || !overlay) {
      return;
    }

    // Lenis owns the scroll position, so lock through it when it is running and
    // fall back to body overflow when smooth scrolling is off.
    var lockScroll = function (locked) {
      if (window.__lenis) {
        if (locked) {
          window.__lenis.stop();
        } else {
          window.__lenis.start();
        }
      }
      document.body.style.overflow = locked ? 'hidden' : '';
    };

    var closeMenu = function () {
      hamburger.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
      overlay.classList.remove('is-open');
      lockScroll(false);
    };

    var openMenu = function () {
      hamburger.setAttribute('aria-expanded', 'true');
      panel.classList.add('is-open');
      overlay.classList.add('is-open');
      lockScroll(true);
    };

    hamburger.addEventListener('click', function (event) {
      event.preventDefault();
      if (hamburger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        hamburger.focus();
      }
    });

    Array.prototype.forEach.call(
      panel.querySelectorAll('.minimalist-nav__mobile-link'),
      function (link) {
        link.addEventListener('click', closeMenu);
      }
    );
  }

  // -------------------------------------------------------------------------
  // Page transitions
  // -------------------------------------------------------------------------
  // Outgoing: six columns wipe up, then the navigation happens.
  // Incoming: a sessionStorage flag set by the outgoing click tells the next
  // page to start covered and retract. The flag is the safety valve — if this
  // script never runs, no page ever starts covered.
  function initPageTransitions() {
    var overlay = document.querySelector('[data-page-transition]');
    if (!overlay || reduceMotion) {
      return;
    }

    var reset = function () {
      overlay.className = 'page-transition';
    };

    if (readFlag() === '1') {
      clearFlag();
      overlay.classList.add('is-revealing');
      // Force a style flush so the retract transition has a start value. rAF is
      // deliberately avoided here: a backgrounded tab throttles it, which would
      // leave the incoming page covered until the reset timer fired.
      void overlay.offsetHeight;
      overlay.classList.add('is-done');
      window.setTimeout(reset, 700);
    }

    document.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      var link = event.target.closest ? event.target.closest('a') : null;
      if (!isInternalNavigation(link)) {
        return;
      }

      event.preventDefault();
      writeFlag();
      overlay.classList.add('is-covering');

      window.setTimeout(function () {
        window.location.href = link.href;
      }, 480);
    });

    // Back/forward out of the bfcache would otherwise restore a covered page.
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) {
        clearFlag();
        reset();
      }
    });
  }

  function isInternalNavigation(link) {
    if (!link || !link.href || link.hasAttribute('download')) {
      return false;
    }
    if (link.target && link.target !== '' && link.target !== '_self') {
      return false;
    }
    if (link.protocol !== 'http:' && link.protocol !== 'https:') {
      return false;
    }
    if (link.origin !== window.location.origin) {
      return false;
    }

    // Same-document hash links are handled by the smooth-scroll code.
    var samePath =
      link.pathname === window.location.pathname && link.search === window.location.search;
    if (link.hash && samePath) {
      return false;
    }

    return !(samePath && !link.hash);
  }

  function readFlag() {
    try {
      return window.sessionStorage.getItem('page-transition');
    } catch (e) {
      return null;
    }
  }

  function writeFlag() {
    try {
      window.sessionStorage.setItem('page-transition', '1');
    } catch (e) {
      /* storage blocked — the incoming half is simply skipped */
    }
  }

  function clearFlag() {
    try {
      window.sessionStorage.removeItem('page-transition');
    } catch (e) {
      /* ignore */
    }
  }

  function parseColor(value, fallback) {
    var hex = (value || '').trim().replace('#', '');
    if (hex.length !== 6) {
      return fallback;
    }
    var parsed = parseInt(hex, 16);
    return isNaN(parsed) ? fallback : parsed;
  }

  function loadScript(src, onload) {
    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = onload;
    script.onerror = function () {
      /* CDN unavailable — hero keeps its CSS gradient fallback. */
    };
    document.head.appendChild(script);
  }
})();
