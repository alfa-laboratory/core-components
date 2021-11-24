#! /usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires, no-console */

const yargs = require('yargs/yargs');
const shell = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const kebab = require('lodash.kebabcase');
const { hideBin } = require('yargs/helpers');

const getTransformerPath = componentName =>
    path.resolve(__dirname, `../src/${kebab(componentName)}/transform.ts`);

function main() {
    const { argv } = yargs(hideBin(process.argv));

    if (argv.help) {
        // TODO: show help
        return;
    }

    if (!argv._ || argv._.length === 0) {
        console.log(
            chalk.red(
                'Укажите glob для файлов, которые нужно трансформировать, например src/**/*.tsx',
            ),
        );

        return;
    }

    if (!argv.transformers || (argv.transformers && typeof argv.transformers !== 'string')) {
        console.log(
            chalk.red(
                'Укажите трансформеры, которые нужно запустить, например --transformers="button-xs,button-views"',
            ),
        );

        return;
    }

    const transformers = argv.transformers.split(',');

    transformers.forEach(transformerName => {
        const transformer = getTransformerPath(transformerName);

        try {
            console.log(chalk.green(`Запускаем ${transformerName}:`));
            shell.exec(`jscodeshift --parser=tsx --transform=${transformer} ${argv._.join(' ')}`);
        } catch (error) {
            console.log(chalk.red(error));
        }
    });
}

main();
