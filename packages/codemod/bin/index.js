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

const availableComponentsTransformers = ['Label', 'Heading', 'Paragraph', 'ButtonXs'];

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

    if (argv.components && typeof argv.components !== 'string') {
        console.log(
            chalk.red(
                'Укажите компоненты, которые хотите заменить, например --components="Label,Heading,Paragraph"',
            ),
        );

        return;
    }

    let components = availableComponentsTransformers;

    if (argv.components) {
        components = argv.components.split(',');
    }

    components.forEach(componentName => {
        if (!availableComponentsTransformers.includes(componentName)) {
            console.log(chalk.yellow(`Для компонента ${componentName} еще нет трансформера`));
            return;
        }

        const transformer = getTransformerPath(componentName);

        try {
            console.log(chalk.green(`Трансформируем ${componentName}:`));
            shell.exec(`jscodeshift --parser=tsx --transform=${transformer} ${argv._.join(' ')}`);
        } catch (error) {
            console.log(chalk.red(error));
        }
    });
}

main();
