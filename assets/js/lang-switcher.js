(function() {
  // Find ALL lang-switcher instances on the page
  var switchers = document.querySelectorAll('.lang-switcher');

  switchers.forEach(function(switcher) {
    var trigger = switcher.querySelector('.lang-switcher__trigger');
    var menu = switcher.querySelector('.lang-switcher__menu');
    if (!trigger || !menu) return;

    function open() { trigger.setAttribute('aria-expanded', 'true'); menu.classList.add('is-open'); }
    function close() { trigger.setAttribute('aria-expanded', 'false'); menu.classList.remove('is-open'); }
    function toggle() { trigger.getAttribute('aria-expanded') === 'true' ? close() : open(); }

    trigger.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); toggle(); });
    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      else if (e.key === 'Escape') { close(); trigger.focus(); }
    });
    menu.addEventListener('keydown', function(e) { if (e.key === 'Escape') { close(); trigger.focus(); } });
  });

  // Close all on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.lang-switcher')) {
      document.querySelectorAll('.lang-switcher__menu.is-open').forEach(function(m) { m.classList.remove('is-open'); });
      document.querySelectorAll('.lang-switcher__trigger[aria-expanded="true"]').forEach(function(t) { t.setAttribute('aria-expanded', 'false'); });
    }
  });
})();
