const globby = require('globby');
const { promisify } = require('util');
const fs = require('fs');
const postcssCustomProperties = require('postcss-custom-properties');
const postcss = require('postcss');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const cssClassNameHashes = new Set();

const getTheme = filePath => {
    const [_, theme] = /themes\/([\w\-]+)/.exec(filePath);

    return theme;
};

async function compileCssVars(filePath) {
    try {
        const theme = getTheme(filePath);

        const css = await readFile(filePath, 'utf-8');

        const result = await postcss([
            postcssCustomProperties({ preserve: false, importFrom: `../themes/dist/${theme}.css` }),
        ]).process(css, { from: css });

        const match = result.css.match(/^\/\* hash: (\w+) \*\/$/m);

        if (match) {
            const hash = match[1];

            cssClassNameHashes.add(hash);

            result.css = result.css.replace(new RegExp(`${hash}`, 'g'), `${hash}_${theme}`);
        }

        await writeFile(filePath, result.css);
    } catch (error) {
        throw error;
    }
}

async function changeClassNames(filePath) {
    try {
        const theme = getTheme(filePath);

        let js = await readFile(filePath, 'utf-8');

        const regExp = new RegExp(
            `${Array.from(cssClassNameHashes)
                .map(hash => `(${hash})`)
                .join('|')}`,
            'g',
        );

        js = js.replace(regExp, `$&_${theme}`);

        await writeFile(filePath, js);
    } catch (error) {
        throw error;
    }
}

async function inject() {
    try {
        const [cssPaths, jsPaths] = await Promise.all([
            globby('dist/themes/**/*.css'),
            globby('dist/themes/**/*.js'),
        ]);

        await Promise.all(cssPaths.map(compileCssVars));
        await Promise.all(jsPaths.map(changeClassNames));
    } catch (error) {
        throw error;
    }
}

inject()
    .then(() => {
        process.exit(0);
    })
    .catch(error => {
        console.error(`Themes injected error: ${error}`);
        process.exit(1);
    });
