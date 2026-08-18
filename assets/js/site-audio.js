/**
 * Site Audio — 8-bit UI sound effects
 * -----------------------------------
 * Every sound is synthesised at runtime with the Web Audio API: oscillators for
 * the tones, a short generated noise buffer for the sweeps. No audio files are
 * downloaded, so the whole layer costs one small script and nothing on the
 * network.
 *
 * Contract:
 *   - The AudioContext is created on the first user gesture, never before.
 *     Browsers block audio until then, and building it earlier just leaves a
 *     suspended context around.
 *   - `window.__sfx.play(name)` is a no-op when muted, unsupported, or when the
 *     context has not been unlocked yet. Callers never need to check.
 *   - The mute state lives in localStorage under `site-sfx` and is reflected on
 *     the [data-sfx-toggle] button.
 *   - Sounds are capped at 0.06 gain and ~220ms. They are punctuation, not
 *     music: anything louder gets tiring on a portfolio page.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'site-sfx';
  var MASTER_GAIN = 0.06;

  var ctx = null;
  var master = null;
  var noiseBuffer = null;
  var enabled = readEnabled();

  // Each entry describes one sound: a list of tone steps, and an optional
  // noise burst layered underneath.
  var SOUNDS = {
    // Soft key press — hover, arrow-key movement in the start menu.
    tick: {
      tones: [{ type: 'square', from: 1180, to: 1180, start: 0, dur: 0.025, gain: 0.35 }]
    },
    // Primary click on a button or link.
    click: {
      tones: [
        { type: 'square', from: 880, to: 660, start: 0, dur: 0.05, gain: 0.8 },
        { type: 'square', from: 1320, to: 1320, start: 0.015, dur: 0.03, gain: 0.25 }
      ]
    },
    // Confirming an action that opens something (menu entry, CTA).
    confirm: {
      tones: [
        { type: 'square', from: 660, to: 660, start: 0, dur: 0.06, gain: 0.7 },
        { type: 'square', from: 990, to: 990, start: 0.06, dur: 0.09, gain: 0.7 }
      ]
    },
    // Drawer sliding open.
    open: {
      tones: [{ type: 'sawtooth', from: 320, to: 900, start: 0, dur: 0.14, gain: 0.4 }],
      noise: { start: 0, dur: 0.12, gain: 0.12, from: 900, to: 4200 }
    },
    // Drawer sliding shut.
    close: {
      tones: [{ type: 'sawtooth', from: 780, to: 260, start: 0, dur: 0.14, gain: 0.4 }],
      noise: { start: 0, dur: 0.12, gain: 0.1, from: 3600, to: 700 }
    },
    // Page transition wipe.
    warp: {
      tones: [{ type: 'square', from: 520, to: 140, start: 0, dur: 0.2, gain: 0.45 }],
      noise: { start: 0, dur: 0.22, gain: 0.16, from: 2600, to: 300 }
    },
    // Toggle switches (theme, CRT, this one).
    toggle: {
      tones: [{ type: 'square', from: 1480, to: 1100, start: 0, dur: 0.045, gain: 0.5 }]
    },
    // A skill bar finishing its fill.
    charge: {
      tones: [{ type: 'triangle', from: 520, to: 1040, start: 0, dur: 0.12, gain: 0.3 }]
    },
    // Konami code accepted.
    unlock: {
      tones: [
        { type: 'square', from: 660, to: 660, start: 0, dur: 0.07, gain: 0.6 },
        { type: 'square', from: 880, to: 880, start: 0.07, dur: 0.07, gain: 0.6 },
        { type: 'square', from: 1100, to: 1100, start: 0.14, dur: 0.07, gain: 0.6 },
        { type: 'square', from: 1320, to: 1320, start: 0.21, dur: 0.14, gain: 0.6 }
      ]
    }
  };

  var api = {
    play: play,
    isEnabled: function () {
      return enabled;
    },
    setEnabled: setEnabled,
    toggle: function () {
      setEnabled(!enabled);
      if (enabled) {
        play('toggle');
      }
    }
  };

  window.__sfx = api;

  // The context can only be created inside a user gesture, so the first click
  // or key press both unlocks audio and plays whatever that interaction wants.
  ['pointerdown', 'keydown'].forEach(function (type) {
    document.addEventListener(type, unlock, { once: false, passive: true });
  });

  bindToggle();

  // ---------------------------------------------------------------------------
  // Playback
  // ---------------------------------------------------------------------------
  function play(name) {
    var spec = SOUNDS[name];
    if (!enabled || !spec || !ctx || ctx.state === 'closed') {
      return;
    }

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    var now = ctx.currentTime;

    spec.tones.forEach(function (tone) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = tone.type;
      osc.frequency.setValueAtTime(tone.from, now + tone.start);
      if (tone.to !== tone.from) {
        osc.frequency.exponentialRampToValueAtTime(tone.to, now + tone.start + tone.dur);
      }

      // Tiny attack, exponential release: a hard stop on a square wave clicks.
      gain.gain.setValueAtTime(0.0001, now + tone.start);
      gain.gain.exponentialRampToValueAtTime(tone.gain, now + tone.start + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.start + tone.dur);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now + tone.start);
      osc.stop(now + tone.start + tone.dur + 0.02);
    });

    if (spec.noise) {
      playNoise(spec.noise, now);
    }
  }

  function playNoise(spec, now) {
    var source = ctx.createBufferSource();
    var filter = ctx.createBiquadFilter();
    var gain = ctx.createGain();

    source.buffer = getNoiseBuffer();
    filter.type = 'bandpass';
    filter.Q.value = 0.8;
    filter.frequency.setValueAtTime(spec.from, now + spec.start);
    filter.frequency.exponentialRampToValueAtTime(spec.to, now + spec.start + spec.dur);

    gain.gain.setValueAtTime(0.0001, now + spec.start);
    gain.gain.exponentialRampToValueAtTime(spec.gain, now + spec.start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + spec.start + spec.dur);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    source.start(now + spec.start);
    source.stop(now + spec.start + spec.dur + 0.02);
  }

  function getNoiseBuffer() {
    if (noiseBuffer) {
      return noiseBuffer;
    }

    var length = Math.floor(ctx.sampleRate * 0.4);
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    var data = noiseBuffer.getChannelData(0);
    for (var i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
  }

  // ---------------------------------------------------------------------------
  // Setup
  // ---------------------------------------------------------------------------
  function unlock() {
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      return;
    }

    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) {
      return;
    }

    try {
      ctx = new Ctor();
    } catch (e) {
      return;
    }

    master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(ctx.destination);
  }

  function readEnabled() {
    try {
      // Opt-out, not opt-in: sound is part of the arcade feel, but a single
      // click on the SFX button turns it off for good.
      return localStorage.getItem(STORAGE_KEY) !== 'off';
    } catch (e) {
      return true;
    }
  }

  function setEnabled(next) {
    enabled = !!next;

    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
    } catch (e) {
      /* storage blocked — the choice just does not persist */
    }

    reflectToggle();
  }

  function bindToggle() {
    var button = document.querySelector('[data-sfx-toggle]');
    if (!button) {
      return;
    }

    button.addEventListener('click', function () {
      api.toggle();
    });

    reflectToggle();
  }

  function reflectToggle() {
    var button = document.querySelector('[data-sfx-toggle]');
    if (button) {
      button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    }
  }
})();
