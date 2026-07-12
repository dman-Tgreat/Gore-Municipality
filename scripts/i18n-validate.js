const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'client', 'src', 'i18n', 'messages.ts');
const out = path.join(__dirname, 'allMessages.cjs');

const content = fs.readFileSync(src, 'utf8');
const marker = 'export const allMessages =';
const idx = content.indexOf(marker);
if (idx === -1) {
  console.error('allMessages export not found in messages.ts');
  process.exit(2);
}

// find the opening brace
const start = content.indexOf('{', idx + marker.length);
let i = start;
let depth = 0;
for (; i < content.length; i++) {
  const ch = content[i];
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) {
      // include this closing brace
      const objText = content.slice(start, i + 1);
      const moduleText = 'module.exports = ' + objText + ' ;\n';
      fs.writeFileSync(out, moduleText, 'utf8');
      break;
    }
  }
}

if (!fs.existsSync(out)) {
  console.error('Failed to extract allMessages object');
  process.exit(2);
}

const all = require(out);
const locales = Object.keys(all);
if (locales.length === 0) {
  console.error('No locales found in extracted allMessages');
  process.exit(2);
}

function collectKeys(obj, prefix = '') {
  const keys = new Set();
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const p = prefix ? prefix + '.' + k : k;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      for (const sub of collectKeys(val, p)) keys.add(sub);
    } else {
      keys.add(p);
    }
  }
  return keys;
}

const keySets = {};
for (const loc of locales) {
  keySets[loc] = collectKeys(all[loc]);
}

let ok = true;
const base = locales[0];
for (const loc of locales.slice(1)) {
  const missing = [];
  for (const k of keySets[base]) {
    if (!keySets[loc].has(k)) missing.push(k);
  }
  if (missing.length) {
    ok = false;
    console.error(`Locale ${loc} is missing ${missing.length} keys compared to ${base}:`);
    missing.slice(0,50).forEach(k => console.error('  -', k));
  }
}

fs.unlinkSync(out);
if (!ok) process.exit(1);
console.log('i18n validation passed — all locales contain same keys (compared to', base, ')');
process.exit(0);
