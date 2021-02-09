const { PurgeCSS } = require('purgecss');
const glob = require('glob');
const fs = require('fs');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const matches = glob.sync('dist/**/*.css', { ignore: 'dist/+(themes|vars|bank-card|grid|toast-plate)/**' });

/**
 * Purgecss вырезает селекторы по атрибуту (например .component[data-popper-placement='left'] .arrow в поповере).
 * https://github.com/FullHuman/purgecss/issues/303
 * После того, как баг будет исправлен, можно будет это удалить, а пока добавляем сюда все такие селекторы.
 */
const whitelistPatternsChildren = [/component/, /filled/, /focused/, /svg/];

matches.forEach(match => {
    const purge = new PurgeCSS();

    purge
        .purge({
            content: ['dist/**/*.js'],
            css: [match],
            variables: true,
            whitelistPatternsChildren,
        })
        .then(result => {
            result.forEach(({ css, file }) => {
                // удаляем пустые блоки :root
                css = css.replace(/^:root {\n}\n/gm, '');
                writeFile(file, css);
            });
        })
        .catch(err => {
            console.log(err);
        });
});
