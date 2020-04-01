const fs = require('fs');
const path = require('path');

const UNDERSCORE_RE = /_/g;
const DASH = '-';

const colorsPath = path.resolve(__dirname, '../node_modules/alfa-ui-primitives/styles/colors.json');
const colors = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));

let css = '';

Object.entries(colors).forEach(([name, token]) => {
    if (token.deprecated) {
        return;
    }

    const formatedName = name.replace(UNDERSCORE_RE, DASH);
    let value = token.a === 1 ? token.hex : token.rgba;

    if (/#(\w)\1{5}/.test(value)) {
        // #ffffff -> #fff;
        value = value.slice(0, 4);
    }

    css += `    --color-${formatedName}: ${value};\n`;
});

const cssPath = path.resolve(__dirname, '../src/vars/src/colors.css');

fs.writeFileSync(cssPath, `:root {\n${css}}\n`);
