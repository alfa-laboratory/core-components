const fs = require('fs');
const path = require('path');

const UNDERSCORE_RE = /_/g;
const DASH = '-';

const colorsPath = path.resolve(
  __dirname,
  '../node_modules/alfa-ui-primitives/styles/colors.json'
);
const colors = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));

let css = '';

Object.entries(colors).forEach(([name, token]) => {
  if (token.deprecated) {
    return;
  }

  name = name.replace(UNDERSCORE_RE, DASH);
  const value = token.a === 1 ? token.hex : token.rgba;

  css += `  --color-${name}: ${value};\n`;
});

const cssPath = path.resolve(__dirname, '../packages/vars/colors.css');

fs.writeFileSync(cssPath, `:root {\n${css}}\n`);
