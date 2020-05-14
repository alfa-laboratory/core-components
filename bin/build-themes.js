const shell = require('shelljs');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

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

// Удаляем файл с дефолтной темой, его публиковать не нужно
shell.rm('dist/default.css');

// Переходим в папку с мисинами и парсим темы
shell.cd('dist/mixins');

const themes = glob.sync('./*.css', {}).map(cssPath => {
    return path.basename(cssPath).replace('.css', '');
});

themes.forEach(theme => {
    let allVars = '';

    // Извлекаем переменные из файлов с миксинами и генерируем css-файлы, записывая переменные в :root
    glob.sync(`./?*/${theme}.css`, {}).forEach(cssFile => {
        const component = path.basename(path.dirname(cssFile));
        const content = fs.readFileSync(cssFile, 'utf-8');
        const vars = extractContentFromMixins(content);

        if (vars) {
            shell.mkdir('-p', `../css/${component}`);
            fs.writeFileSync(`../css/${component}/${theme}.css`, toRoot(vars));

            // Собираем переменные компонентов в один файл
            allVars += `\n    /**\n     * === ${component} ===\n     */\n${vars}`;
        }
    });

    if (allVars.length) {
        fs.writeFileSync(`../css/${theme}.css`, toRoot(allVars));
    }
});

// Переносим сгенерированные css-файлы в /dist
shell.cd('../');
shell.cp('-R', './css/.', './');
shell.rm('-rf', './css');
