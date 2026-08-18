/**
 * Regenerate the PIN gate credentials in _data/gate.yml.
 *
 *   node tools/make-pin.js 123456
 *
 * The PIN itself is never written anywhere: only a random salt and a PBKDF2
 * derivation of it are stored, so the repository never contains the code.
 * `tools/` is excluded from the Jekyll build, so this file is not published.
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ITERATIONS = 600000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';

const pin = process.argv[2];

if (!pin || !/^\d{4,12}$/.test(pin)) {
  console.error('Usage: node tools/make-pin.js <4-12 digit pin>');
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const hash = crypto.pbkdf2Sync(pin, salt, ITERATIONS, KEY_LENGTH, DIGEST);

const file = [
  '# PIN gate for /post/.',
  '#',
  '# This file holds a PBKDF2-SHA256 derivation of the PIN, never the PIN itself.',
  '# Regenerate it with:  node tools/make-pin.js <new pin>',
  '#',
  '# Be clear-eyed about what this is: the site is static, so the check happens',
  '# in the browser and these values are public. It keeps casual visitors out of',
  '# the editor. It is not what protects publishing — that is the GitHub token,',
  '# which lives only in your browser and is never committed.',
  `salt: "${salt.toString('base64')}"`,
  `hash: "${hash.toString('base64')}"`,
  `iterations: ${ITERATIONS}`,
  ''
].join('\n');

fs.writeFileSync(path.join(__dirname, '..', '_data', 'gate.yml'), file);
console.log('Wrote _data/gate.yml (salt + derived hash only).');
