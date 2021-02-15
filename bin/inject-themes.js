const globby = require('globby');
const { promisify } = require('util');
const fs = require('fs');
const postcssCustomProperties = require('postcss-custom-properties');
const postcss = require('postcss');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function compileCssVars(path) {
    try {
        const [_, theme] = /themes\/([\w\-]+)/.exec(path);

        const css = await readFile(path, 'utf-8');

        const result = await postcss([
            postcssCustomProperties({ preserve: false, importFrom: `../themes/dist/${theme}.css` }),
        ]).process(css, { from: css });

        await writeFile(path, result.css);
    } catch (error) {
        throw error;
    }
}

async function inject() {
    try {
        const paths = await globby('dist/themes/**/*.css');

        await Promise.all(paths.map(compileCssVars));
    } catch (error) {
        throw error;
    }
}

inject().catch(error => {
    console.error(`Themes injected error: ${error}`);
    process.exit(1);
});
