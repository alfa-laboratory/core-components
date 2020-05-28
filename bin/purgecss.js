const { PurgeCSS } = require('purgecss');
const glob = require('glob');
const fs = require('fs');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const matches = glob.sync('dist/**/*.css', { ignore: 'dist/+(themes|vars)/**' });

matches.forEach(match => {
    const purge = new PurgeCSS();

    purge
        .purge({
            content: ['dist/**/*.js'],
            css: [match],
            variables: true,
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
