import globby from 'globby';
import postcss from 'postcss';
import path from 'path';

import { readFile, writeFile, checkOrCreateDir } from './common';

const cleanerPlugin = postcss.plugin('styles-cleaner-plugin', () => root => {
    // Удаляем все правила, где нет цветов
    root.walkDecls(decl => {
        const hasColor = ['rgb', '#', 'transparent'].some(token => decl.value.includes(token));

        if (!hasColor) {
            decl.remove();
        }
    });

    // Удаляем комменты
    root.walkComments(comment => comment.remove());

    // Удаляем пустые atrule
    root.walkAtRules(atRule => {
        if (atRule.nodes.length === 1 && atRule.nodes[0].nodes.length === 0) {
            atRule.remove();
        }
    });

    // Удаляем пустые правила
    root.walkRules(rule => {
        if (rule.nodes.length === 0) {
            rule.remove();
        }
    });
});

const setupPostcss = (theme, mode, palette) => {
    const colorsPath = path.resolve(__dirname, 'packages/vars/dist');
    const themesPath = path.resolve(__dirname, 'packages/themes/dist');

    return [
        require('postcss-custom-properties')({
            preserve: false,
            importFrom: [
                // подключаем тему продукта
                theme !== 'default' && `${themesPath}/${theme}.css`,
                // подключаем палитру цветов
                palette === 'bluetint' && `${colorsPath}/colors-${palette}.css`,
                // подключаем темную тему
                mode === 'dark' && `${themesPath}/dark.css`,
            ].filter(Boolean),
        }),
        cleanerPlugin(),
    ];
};

async function generateTheme(source, theme, mode, palette) {
    const content = await readFile(source, 'utf-8');

    const result = await postcss(setupPostcss(theme, mode, palette)).process(content, {
        from: source,
    });

    return result.css.replace(/\n\s*\n/g, '\n').trim();
}

export function compiledDarkmodeGenerator(dist) {
    return {
        name: 'compiled-darkmode-generator',
        writeBundle: async () => {
            if (dist.includes('themes') || dist.includes('vars')) return;

            const generationConfig = ['mobile-dark-bluetint'];

            const componentStyles = await globby([`${dist}/**/*.css`], {
                ignore: ['**/cssm/**', '**/esm/**', '**/modern/**'],
            });

            const saveTheme = async (css, fileName) => {
                if (!css.trim()) return;

                const dir = `${__dirname}/packages/themes/dist/compiled`;

                await checkOrCreateDir(dir);

                await writeFile(`${dir}/${fileName}.css`, css, {
                    flag: 'a',
                });
            };

            const generate = configString =>
                Promise.all(
                    componentStyles.map(cssFile =>
                        generateTheme(cssFile, ...configString.split('-')),
                    ),
                )
                    .then(styles => styles.join('\n'))
                    .then(css => saveTheme(css, configString));

            return Promise.all(generationConfig.map(generate));
        },
    };
}
