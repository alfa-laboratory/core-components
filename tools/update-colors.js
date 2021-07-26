const fs = require('fs');
const glob = require('glob');
const path = require('path');

const UNDERSCORE_RE = /_/g;
const DASH = '-';

const colorsDir = path.resolve(__dirname, '../node_modules/alfa-ui-primitives/styles');

glob(path.join(colorsDir, 'colors*.json'), {}, (err, files) => {
    files.forEach(pathname => {
        const colors = requireColors(pathname);

        generateColorMods(colors);

        let css = '';

        Object.entries(colors).forEach(([name, token]) => {
            if (token.deprecated) {
                return;
            }
            const colorName = `--color-${name}`;
            let value = token.a === 1 || token.hex.length <= 7 ? token.hex : token.rgba;
            css += `    ${colorName}: ${value};\n`;
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
        (
            Object.keys(colors).find(
                color =>
                    color.includes('dark') &&
                    lightColor.replace(/^light-/, '') === color.replace(/^dark-/, ''),
            ) || ''
        ).replace(/-(tint|shade)-/, v => {
            return v === '-shade-' ? '-tint-' : '-shade-';
        });

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
            if (/^light-/.test(color)) {
                const pair = findPair(color);

                if (pair) {
                    css += `    --color-${color}: var(--color-${pair});\n`;
                } else {
                    console.warn(`No pair found for '${color}' color.`);
                }
            }
        });

        css += '}';

        fs.writeFileSync(path.join(mixinsDir, mixinFileName), css);
    }
}

function requireColors(pathname) {
    return Object.entries(require(pathname)).reduce((acc, [name, value]) => {
        acc[name.replace(UNDERSCORE_RE, DASH)] = value;
        return acc;
    }, {});
}

function hasMods(colorName) {
    // TODO
    return [
        'bg-accent',
        'bg-neutral',
        'bg-primary',
        'bg-primary-inverted',
        'bg-secondary-inverted',
        'bg-tertiary',
        'graphic-accent',
        'graphic-neutral',
        'graphic-negative',
        'graphic-positive',
        'graphic-primary',
        'graphic-secondary',
        'specialbg-component',
        'specialbg-component-inverted',
        'text-link',
        'text-primary',
        'text-primary-inverted',
        'text-secondary',
        'static-status-blue',
        'static-status-green',
        'static-status-grey',
        'static-status-orange',
        'static-status-purple',
        'static-status-red',
        'static-status-teal',
    ].some(c => colorName.includes(c));
}

function generateColorMods(colors) {
    const modsConfig = [
        ['alpha', ['3', '7', '8', '10', '12', '15', '20', '30', '40', '50', '90']],
        ['tint', ['7', '10', '15', '20', '30', '40', '50', '90']],
        ['shade', ['7', '10', '15', '20', '30', '40', '50', '90']],
    ];

    Object.entries(colors).forEach(([colorName, token]) => {
        if (!hasMods(colorName)) return;

        modsConfig.forEach(([mod, modValues]) => {
            modValues.forEach(modValue => {
                const modName = `${colorName}-${mod}-${modValue}`;

                const colorValue = token.a === 1 || token.hex.length <= 7 ? token.hex : token.rgba;

                colors[modName] = {
                    a: 1,
                    hex: `color-mod(${colorValue} ${mod}(${modValue}%));`,
                };
            });
        });
    });
}
