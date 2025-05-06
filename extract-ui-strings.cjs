// extract-ui-strings.js
const glob = require('glob');
const fs = require('fs');
const path = require('path');

// 1. Define your folder globs:
const files = glob.sync([
  './*.js',                          // root JS files (renderer.js, server.js, etc.)
  './api/**/*.{js,jsx}',             // all JS/JSX under /api
  './assets/js/**/*.{js,jsx}',       // all JS/JSX under /assets/js
  './public/**/*.{js,jsx,html}'      // JS/JSX/HTML under /public
]);

const stringSet = new Set();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // regex to find text in quotes
  const regex = /(['"`])((?:(?!\1).)+)\1/g;
  let m;
  while (m = regex.exec(content)) {
    const txt = m[2].trim();
    // heuristics: skip code tokens, empty, too long, URLs, templates
    if (
      txt &&
      /[A-Za-z]/.test(txt) &&
      !txt.startsWith('http') &&
      !/[\{\}\$]/.test(txt) &&
      txt.length < 100
    ) {
      stringSet.add(txt);
    }
  }
});

const output = {};
[...stringSet].sort().forEach(str => {
  // use the raw English text as both key and value for now
  output[str] = str;
});

// ensure locales folder exists
fs.mkdirSync(path.join(__dirname, 'locales'), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, 'locales', 'en.json'),
  JSON.stringify(output, null, 2),
  'utf8'
);

console.log(`Extracted ${stringSet.size} unique strings to locales/en.json`);
