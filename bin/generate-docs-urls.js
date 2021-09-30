const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const camelCase = require('lodash.camelcase');
const upperfirst = require('lodash.upperfirst');

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const excludedPackages = ['codemod', 'screenshot-utils', 'themes', 'utils', 'vars'];

const isComponent = dir => !excludedPackages.includes(dir) && !dir.includes('.');

const packagesDir = path.join(process.cwd(), 'packages');
const buildDir = path.join(process.cwd(), process.env.STORYBOOK_BUILD_DIR || 'build');

async function main() {
    const packagesNames = (await readDir(packagesDir)).filter(isComponent);

    const packagesInfos = await Promise.all(
        packagesNames.map(packageName =>
            readFile(path.join(packagesDir, packageName, 'package.json'), 'utf-8').then(str =>
                JSON.parse(str),
            ),
        ),
    );

    const components = packagesInfos.map(packageInfo => {
        const packageName = packageInfo.name.replace('@alfalab/core-components-', '');
        const componentName = upperfirst(camelCase(packageName));

        return {
            name: componentName,
            docsUrl: `/iframe.html?id=компоненты-${packageName.replace(
                /-/g,
                '',
            )}--${packageName}&viewMode=docs`,
        };
    });

    const json = {
        components,
        breakPoints: {
            name: 'Брейкпоинты',
            docsUrl: '/iframe.html?id=гайдлайны-брейкпоинты--page',
        },
        gaps: {
            name: 'Отступы',
            docsUrl: '/iframe.html?id=гайдлайны-отступы--page',
        },
        cssVars: {
            name: 'CSS-переменные',
            docsUrl: '/iframe.html?id=гайдлайны-css-переменные--page',
        },
    };

    await writeFile(path.join(buildDir, 'docs-urls.json'), JSON.stringify(json));
}

main()
    .then(() => {
        console.log('DONE');
        process.exit(0);
    })
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
