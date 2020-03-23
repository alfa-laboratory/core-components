import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const UNDERSCORE_RE = /_/g;
const DASH = '-';

const colorsPath = resolve(
  __dirname,
  '../node_modules/alfa-ui-primitives/styles/colors.json',
);
const colors = JSON.parse(readFileSync(colorsPath, 'utf8'));

let css = '';

Object.entries(colors).forEach(([name, token]) => {
  if (token.deprecated) {
    return;
  }

  const formatedName = name.replace(UNDERSCORE_RE, DASH);
  const value = token.a === 1 ? token.hex : token.rgba;

  css += `  --color-${formatedName}: ${value};\n`;
});

const cssPath = resolve(__dirname, '../packages/vars/colors.css');

writeFileSync(cssPath, `:root {\n${css}}\n`);
