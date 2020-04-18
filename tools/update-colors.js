const fs = require('fs');
const path = require('path');

const UNDERSCORE_RE = /_/g;
const DASH = '-';

const colors = require('../node_modules/alfa-ui-primitives/styles/colors.json');

let css = '';

Object.entries(colors).forEach(([name, token]) => {
    if (token.deprecated) {
        return;
    }

    const formatedName = name.replace(UNDERSCORE_RE, DASH);
    let value = token.a === 1 ? token.hex : token.rgba;

    css += `    --color-${formatedName}: ${value};\n`;
});

const cssPath = path.resolve(__dirname, '../packages/vars/src/colors.css');

fs.writeFileSync(cssPath, `:root {\n${css}}\n`);
