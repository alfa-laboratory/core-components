const fs = require('fs');
const glob = require('glob');
const path = require('path');

const colorMods = require('./color-mods.json');

const UNDERSCORE_RE = /_/g;
const DASH = '-';

const colorsDir = path.resolve(__dirname, '../node_modules/alfa-ui-primitives/styles');

glob(path.join(colorsDir, 'colors*.json'), {}, (err, files) => {
    files.forEach(pathname => {
        const colors = requireColors(pathname);

        generateColorMods(colors);

        let css = '';

        Object.entries(colors).forEach(([color, token]) => {
            if (token.deprecated) {
                return;
            }

            let value = token.hex && token.hex.length <= 7 ? token.hex : token.rgba;
            css += `    ${buildVarName(color)}: ${value};\n`;
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
    const mixinsDir = path.resolve(__dirname, '../packages/themes/src/mixins/colors');
    const mixinFileName = path
        .basename(pathname)
        .replace('.json', '.css')
        .replace('_', '-');

    let css = '@define-mixin dark-theme {\n';

    if (pathname.includes('bluetint') || pathname.includes('indigo')) {
        Object.keys(colors).forEach(color => {
            if (/^light-/.test(color) === false) return;

            const pair = color
                .replace(/^light-/, 'dark-')
                .replace(/-(shade|tint)-/, v => (v === '-shade-' ? '-tint-' : '-shade-'));

            if (colors[pair]) {
                css += `    ${buildVarName(color)}: var(--color-${pair});\n`;
            } else {
                console.warn(`No pair found for '${color}' color.`);
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

function generateColorMods(colors) {
    Object.entries(colors).forEach(([colorName, token]) => {
        const modsConfig = getModsConfig(colorName);

        if (!modsConfig) return;

        Object.entries(modsConfig).forEach(([mod, modValues]) => {
            modValues.forEach(modValue => {
                const generatedColorName = `${colorName}-${mod}-${modValue}`;

                const colorValue = token.hex.length <= 7 ? token.hex : token.rgba;

                if (['tint', 'shade'].includes(mod) && token.hex.length > 7) {
                    colors[generatedColorName] = {
                        hex: '',
                        rgba: `color-mod(${colorValue} blenda(${
                            mod === 'tint' ? 'white' : 'black'
                        } ${modValue}%));`,
                    };
                } else {
                    colors[generatedColorName] = {
                        hex: '',
                        rgba: `color-mod(${colorValue} ${mod}(${modValue}%));`,
                    };
                }
            });
        });
    });
}

function getModsConfig(colorName) {
    const config = colorMods[colorName.replace('dark-', 'light-')];

    if (!config) return null;

    const isDark = colorName.startsWith('dark-');

    if (isDark) {
        return Object.entries(config).reduce((acc, [mod, modValue]) => {
            acc[invertMod(mod)] = modValue;

            return acc;
        }, {});
    } else {
        return config;
    }
}

function invertMod(mod) {
    if (mod === 'tint') return 'shade';
    if (mod === 'shade') return 'tint';
    return mod;
}

function buildVarName(colorName) {
    return `--color-${colorName}`;
}
