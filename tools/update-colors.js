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
            let value = token.a === 1 || token.hex.length <= 7 ? token.hex : token.rgba;
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

        updateDarkThemeMixins(pathname, colors);
    });
});

function updateDarkThemeMixins(pathname, colors) {
    const findPair = lightColor =>
        Object.keys(colors).find(
            color =>
                color.includes('dark') &&
                lightColor.replace(/^light_/, '') === color.replace(/^dark_/, ''),
        );

    const mixinsDir = path.resolve(__dirname, '../packages/themes/src/mixins/colors');
    const mixinFileName = path
        .basename(pathname)
        .replace('.json', '.css')
        .replace('_', '-');

    let css = '@define-mixin dark-theme {\n';

    if (pathname.includes('bluetint') || pathname.includes('indigo')) {
        const colorsMap = {
            /** [lightColorName: string]: string (darkColorName) */
        };

        Object.keys(colors).forEach(color => {
            if (/^light_/.test(color)) {
                const pair = findPair(color);

                if (pair) {
                    const formatedName = color.replace(UNDERSCORE_RE, DASH);
                    const formattedPairName = pair.replace(UNDERSCORE_RE, DASH);
                    css += `    --color-${formatedName}: var(--color-${formattedPairName});\n`;
                } else {
                    console.warn(`No pair found for '${color}' color.`);
                }
            }
        });

        css += '}';

        fs.writeFileSync(path.join(mixinsDir, mixinFileName), css);
    }
}
