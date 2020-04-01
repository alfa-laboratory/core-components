const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const typographyPath = resolve(
    __dirname,
    '../node_modules/alfa-ui-primitives/styles/typography_web.json',
);
const typography = JSON.parse(fs.readFileSync(typographyPath, 'utf8'));

let out = [];

out.push(compileTemplate('font-preset-mixin.css.hbs'));

Object.entries(typography).forEach(([name, settings]) => {
    if (settings.deprecated) return;

    out.push(
        compileTemplate('font-style-mixin.css.hbs', {
            name,
            ...normalizeSettings(settings),
        }),
    );
});

const cssPath = path.resolve(__dirname, '../src/vars/src/typography.css');

fs.writeFileSync(cssPath, out.join('\n'));

// FUNCTIONS

function compileTemplate(filename, data) {
    const templatePath = path.resolve(__dirname, `./templates/${filename}`);
    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    return template(data);
}

function normalizeSettings(settings) {
    const rules = {
        font_weight: v => {
            if (v === 'medium') return 500;
            if (v === 'regular') return 'normal';
            return v;
        },
        letter_spacing: v => {
            return v ? `${v}px` : 'normal';
        },
    };

    Object.entries(settings).forEach(([name, value]) => {
        if (name in rules) {
            settings[name] = rules[name](value);
        }
    });

    return settings;
}
