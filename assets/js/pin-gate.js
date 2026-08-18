/**
 * PIN Gate
 * --------
 * Keeps the post editor behind a numeric PIN.
 *
 * What this is: a lock on the door of an owner-only tool, so a stray visitor
 * who guesses the /post/ URL does not land in an editor.
 *
 * What this is not: real access control. The site is static, so the check runs
 * in the browser and the salt and hash it compares against are public. Someone
 * determined can read them and brute-force a six-digit PIN offline. The thing
 * that actually protects publishing is the GitHub token, which lives only in
 * the owner's browser and is never committed.
 *
 * The PIN is compared as PBKDF2-SHA256 (600k iterations) against the values in
 * _data/gate.yml, so the PIN itself appears nowhere in the repository.
 */
(function () {
  'use strict';

  var gate = document.querySelector('[data-gate]');
  if (!gate) {
    return;
  }

  var UNLOCK_KEY = 'post-gate-unlocked';
  var SESSION_HOURS = 8;

  var config = {
    salt: gate.getAttribute('data-salt'),
    hash: gate.getAttribute('data-hash'),
    iterations: parseInt(gate.getAttribute('data-iterations'), 10) || 600000
  };

  var protectedArea = document.querySelector('[data-gated]');
  var form = gate.querySelector('[data-gate-form]');
  var input = gate.querySelector('[data-gate-input]');
  var message = gate.querySelector('[data-gate-message]');
  var lockButton = document.querySelector('[data-gate-lock]');

  if (isUnlocked()) {
    unlock();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    verify(input.value.trim());
  });

  if (lockButton) {
    lockButton.addEventListener('click', lockAgain);
  }

  // ---------------------------------------------------------------------------
  // Verification
  // ---------------------------------------------------------------------------
  function verify(pin) {
    if (!pin) {
      return setMessage('Enter the PIN.', 'error');
    }

    if (!window.crypto || !window.crypto.subtle) {
      return setMessage('This browser cannot run the check (WebCrypto unavailable).', 'error');
    }

    setMessage('Checking…', 'busy');
    form.querySelector('button').disabled = true;

    derive(pin)
      .then(function (derived) {
        form.querySelector('button').disabled = false;

        if (timingSafeEqual(derived, config.hash)) {
          remember();
          unlock();
          setMessage('', 'ok');
          return;
        }

        input.value = '';
        input.focus();
        setMessage('Wrong PIN.', 'error');
      })
      .catch(function () {
        form.querySelector('button').disabled = false;
        setMessage('Could not verify the PIN. Reload and try again.', 'error');
      });
  }

  function derive(pin) {
    var encoder = new TextEncoder();

    return window.crypto.subtle
      .importKey('raw', encoder.encode(pin), { name: 'PBKDF2' }, false, ['deriveBits'])
      .then(function (key) {
        return window.crypto.subtle.deriveBits(
          {
            name: 'PBKDF2',
            salt: fromBase64(config.salt),
            iterations: config.iterations,
            hash: 'SHA-256'
          },
          key,
          256
        );
      })
      .then(function (bits) {
        return toBase64(new Uint8Array(bits));
      });
  }

  // Constant-time-ish comparison. The values are public, so this changes very
  // little, but there is no reason to leak the position of the first mismatch.
  function timingSafeEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    var diff = 0;
    for (var i = 0; i < a.length; i++) {
      diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
  }

  // ---------------------------------------------------------------------------
  // Lock state
  // ---------------------------------------------------------------------------
  function isUnlocked() {
    try {
      var until = parseInt(sessionStorage.getItem(UNLOCK_KEY), 10);
      return !!until && Date.now() < until;
    } catch (e) {
      return false;
    }
  }

  function remember() {
    try {
      // sessionStorage, not localStorage: closing the tab locks the editor
      // again, and the timestamp caps a forgotten open tab.
      sessionStorage.setItem(UNLOCK_KEY, String(Date.now() + SESSION_HOURS * 3600 * 1000));
    } catch (e) {
      /* storage blocked — the gate simply asks again next time */
    }
  }

  function unlock() {
    gate.hidden = true;
    if (protectedArea) {
      protectedArea.hidden = false;
    }
    if (lockButton) {
      lockButton.hidden = false;
    }
  }

  function lockAgain() {
    try {
      sessionStorage.removeItem(UNLOCK_KEY);
    } catch (e) {
      /* ignore */
    }

    gate.hidden = false;
    if (protectedArea) {
      protectedArea.hidden = true;
    }
    if (lockButton) {
      lockButton.hidden = true;
    }
    input.value = '';
    input.focus();
    setMessage('Locked.', 'ok');
  }

  function setMessage(text, kind) {
    message.textContent = text;
    message.className = 'gate__message is-' + kind;
  }

  // ---------------------------------------------------------------------------
  // Base64 helpers
  // ---------------------------------------------------------------------------
  function fromBase64(value) {
    var binary = atob(value);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function toBase64(bytes) {
    var binary = '';
    bytes.forEach(function (byte) {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }
})();
