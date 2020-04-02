const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const typography = require('../node_modules/alfa-ui-primitives/styles/typography_web.json');

const out = [
    compileTemplate('font-preset-mixin.css.hbs')
];

Object.entries(typography).forEach(([name, rules]) => {
    if (rules.deprecated) return;

    out.push(
        compileTemplate('font-style-mixin.css.hbs', {
            name,
            ...normalizeRules(rules),
        }),
    );
});

const cssPath = path.resolve(__dirname, '../src/vars/src/typography.css');

fs.writeFileSync(cssPath, out.join('\n'));

/**
 * Компилирует handlebars шаблон
 *
 * @param {string} filename
 * @param {Object} data
 * @returns {string}
 */
function compileTemplate(filename, data) {
    const templatePath = path.resolve(__dirname, `./templates/${filename}`);
    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    return template(data);
}

/**
 * Преобразовывает значения из набора в валидные css значения в соответствии с набором правил
 *
 * @param {Object} rules
 * @returns {Object}
 */
function normalizeRules(rules) {
    const convertRules = {
        font_weight: v => {
            if (v === 'medium') return 500;
            if (v === 'regular') return 'normal';
            return v;
        },
        letter_spacing: v => {
            return v ? `${v}px` : 'normal';
        },
    };

    Object.entries(rules).forEach(([name, value]) => {
        if (name in convertRules) {
            rules[name] = convertRules[name](value);
        }
    });

    return rules;
}
