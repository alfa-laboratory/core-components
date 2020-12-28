const shell = require('shelljs');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const postcssColorMod = require('postcss-color-mod-function');

// Записывает правила в :root
const toRoot = rules => `:root {${rules}}\n`;

// Возвращает контент миксина
const extractContentFromMixins = css => {
    if ((css.match(/@define-mixin/g) || []).length != 1) {
        throw new Error('Theme file should contain exactly one mixin');
    }

    const match = /@define-mixin.*{([\s\S]*?)}/gm.exec(css);

    if (match) return match[1];
};

// Удаляет импорты переменных из миксинов
const removeImports = css => {
    return css.replace(/^@import .*$\n+/gm, '');
};

// Прогоняет контент через postcss, применяя postcss-color-mod-function
const filesWithVars = glob.sync(path.resolve(__dirname, '../packages/vars/src/*.css'));

const processPostCss = async (content, cssFile) =>
    postcss([
        postcssColorMod({
            unresolved: 'throw',
            importFrom: filesWithVars,
        }),
    ])
        .process(content, { from: cssFile, to: cssFile })
        .then(result => result.css);

(async () => {
    // Удаляем файл с дефолтной темой, его публиковать не нужно
    shell.rm('dist/default.css');

    // Переходим в папку с мисинами и парсим темы
    shell.cd('dist/mixins');

    const themes = glob
        .sync('./*.css', {})
        .map(cssPath => path.basename(cssPath).replace('.css', ''));

    for (const theme of themes) {
        let allVars = '';

        // Извлекаем переменные из файлов с миксинами и генерируем css-файлы, записывая переменные в :root
        const cssFiles = glob.sync(`./?*/${theme}.css`, { absolute: true });

        for (let cssFile of cssFiles) {
            const component = path.basename(path.dirname(cssFile));
            // В сборке тем не должно быть color-mod - прогоняем через color-mod-function
            const content = removeImports(
                await processPostCss(fs.readFileSync(cssFile, 'utf-8'), cssFile),
            );
            fs.writeFileSync(cssFile, content);

            const vars = extractContentFromMixins(content);

            if (vars) {
                shell.mkdir('-p', `../css/${component}`);
                fs.writeFileSync(`../css/${component}/${theme}.css`, toRoot(vars));

                // Собираем переменные компонентов в один файл
                allVars += `\n    /**\n     * === ${component} ===\n     */\n${vars}`;
            }
        }

        if (allVars.length) {
            fs.writeFileSync(`../css/${theme}.css`, toRoot(allVars));
        }
    }

    const colorsFiles = glob.sync('./colors/*.css', {});

    colorsFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const vars = extractContentFromMixins(content);

        shell.mkdir('-p', `../css/colors`);

        const css = toRoot(vars);

        fs.writeFileSync(`../css/colors/${path.basename(file)}`, css);
        fs.writeFileSync(
            `../css/colors/${path.basename(file).replace(/\.css$/, '.js')}`,
            `module.exports = \`${css}\``,
        );
    });

    // Переносим сгенерированные css-файлы в /dist
    shell.cd('../');
    shell.cp('-R', './css/.', './');
    shell.rm('-rf', './css');
})();
