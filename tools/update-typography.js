const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const typography = require('../node_modules/alfa-ui-primitives/styles/typography_web.json');

const out = [compileTemplate('font-vars.css.hbs')];

Object.entries(typography).forEach(([name, rules]) => {
    out.push(
        compileTemplate('font-style-mixin.css.hbs', {
            name,
            rules: normalizeRules(rules),
        }),
    );
});

const cssPath = path.resolve(__dirname, '../packages/vars/src/typography.css');

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
 * Преобразовывает значения из набора в валидные css значения
 *
 * @param {Object} rules
 * @returns {Object}
 */
function normalizeRules(rules) {
    const nonPxRules = ['font-weight'];

    return Object.entries(rules).reduce((acc, [name, value]) => {
        name = name.replace(/_/, '-').toLocaleLowerCase();

        if (typeof value === 'number' && !nonPxRules.includes(name)) {
            value = `${value}px`;
        }

        switch (name) {
            case 'font-family':
                if (value === 'var(--font-family-styrene)') {
                    acc['font-feature-settings'] = `'ss01'`;
                }

                if (value !== 'var(--font-family-system)') {
                    acc[name] = value;
                }
                break;
            case 'deprecated':
                break;
            default:
                acc[name] = value;
        }

        return acc;
    }, {});
}
