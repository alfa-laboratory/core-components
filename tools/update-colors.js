const fs = require('fs');
const glob = require('glob');
const path = require('path');

const UNDERSCORE_RE = /_/g;
const DASH = '-';

const colorsDir = path.resolve(__dirname, '../node_modules/alfa-ui-primitives/styles');

glob(path.join(colorsDir, 'colors*.json'), {}, (err, files) => {
    files.forEach(pathname => {
        const colors = require(pathname);

        let css = '';
        Object.entries(colors).forEach(([name, token]) => {
            if (token.deprecated) {
                return;
            }
            const formatedName = name.replace(UNDERSCORE_RE, DASH);
            let value = token.a === 1 ? token.hex : token.rgba;
            css += `    --color-${formatedName}: ${value};\n`;
        });

        const cssPath = path.resolve(
            __dirname,
            '../packages/vars/src',
            path
                .basename(pathname)
                .replace('.json', '.css')
                .replace('_', '-'),
        );

        fs.writeFileSync(cssPath, `:root {\n${css}}\n`);
    });
});
