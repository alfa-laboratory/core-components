const shell = require('shelljs');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const postcssColorMod = require('postcss-color-mod-function');
const postcssImport = require('postcss-import');
const postcssMixins = require('postcss-mixins');

const replaceMixinToRoot = css => css.replace(/@define-mixin.*$/m, ':root {');

const bluetintThemes = ['mobile', 'intranet'];
const getPalette = cssFile =>
    bluetintThemes.some(x => cssFile.includes(x)) ? 'bluetint' : 'indigo';

const createColorsByPaletteFilter = palette => {
    return filePath => {
        if (palette === 'indigo' && filePath.includes('colors-bluetint')) return false;
        if (palette === 'bluetint' && filePath.includes('colors-indigo')) return false;
        return true;
    };
};

const processComponentTheme = cssFile => {
    const palette = getPalette(cssFile);

    const colors = glob
        .sync(path.resolve(__dirname, '../packages/vars/src/colors-*.css'))
        .filter(createColorsByPaletteFilter(palette));

    const content = fs.readFileSync(cssFile, 'utf-8');

    return postcss([
        postcssImport({}),
        postcssColorMod({
            unresolved: 'throw',
            importFrom: colors,
        }),
    ])
        .process(content, { from: cssFile, to: cssFile })
        .then(result => result.css);
};

const processRootTheme = cssFile => {
    const getImports = () => {
        if (cssFile.includes('dark.css')) return [];

        const palette = getPalette(cssFile);

        return glob
            .sync(path.resolve(__dirname, '../packages/vars/src/*.css'))
            .filter(createColorsByPaletteFilter(palette))
            .filter(varFile => varFile.includes('index.css') === false)
            .map(varFile => `@import '${varFile}';`);
    };

    const withImports = css =>
        getImports()
            .concat(css)
            .join('\n');

    // Добавляем импорты переменных, меняем миксин на :root
    const content = withImports(replaceMixinToRoot(fs.readFileSync(cssFile, 'utf-8')));

    return postcss([
        postcssImport({}),
        postcssMixins({}),
        postcssColorMod({
            unresolved: 'throw',
        }),
    ])
        .process(content, { from: cssFile, to: cssFile })
        .then(result => result.css);
};

(async () => {
    // Удаляем файл с дефолтной темой, его публиковать не нужно
    shell.rm('dist/default.css');

    // Переходим в папку с мисинами и парсим темы
    shell.cd('dist/mixins');

    const themes = glob.sync('./*.css', {});

    for (const themeFile of themes) {
        const theme = path.basename(themeFile).replace('.css', '');

        // Извлекаем переменные из файлов с миксинами и генерируем css-файлы, записывая переменные в :root
        const cssFiles = glob.sync(`./?*/${theme}.css`, { absolute: true });

        for (let cssFile of cssFiles) {
            const content = await processComponentTheme(cssFile);

            const component = path.basename(path.dirname(cssFile));

            fs.writeFileSync(cssFile, content);

            shell.mkdir('-p', `../css/${component}`);

            fs.writeFileSync(`../css/${component}/${theme}.css`, replaceMixinToRoot(content));
        }

        const content = await processRootTheme(themeFile);
        fs.writeFileSync(`../css/${theme}.css`, content);
    }

    // Переносим сгенерированные css-файлы в /dist
    shell.cd('../');
    shell.cp('-R', './css/.', './');
    shell.rm('-rf', './css');
})();
