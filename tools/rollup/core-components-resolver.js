import path from 'path';

import { requireRegExp } from './common';

/**
 * Заменяет все импорты кор-компонентов на относительные пути.
 * Используется для сборки агрегирующего пакета.
 */
export const coreComponentsRootPackageResolver = ({ currentPackageDir }) => ({
    name: 'core-components-root-package-resolver',
    generateBundle: (_, bundles) => {
        Object.keys(bundles).forEach(bundleName => {
            let code = bundles[bundleName].code;

            let matches;
            while ((matches = requireRegExp.exec(code))) {
                const componentName = matches[2];

                const distDir = path.resolve(currentPackageDir, 'dist');
                const bundleAbsPath = path.join(distDir, bundleName);
                const bundleDir = path.dirname(bundleAbsPath);
                const componentRelativePath = path
                    .relative(bundleDir, componentName)
                    .replace('/dist', ''); // удаляем dist из пути, так как в рут-пакете его нет

                code = code.replace(requireRegExp, `$1${componentRelativePath}$3`);
            }

            bundles[bundleName].code = code;
        });

        return bundles;
    },
});

/**
 * Заменяет импорты компонентов для сборки modern/cssm/esm
 */
export const coreComponentsResolver = ({ importFrom }) => ({
    name: 'core-components-resolver',
    generateBundle: (_, bundles) => {
        Object.keys(bundles).forEach(bundleName => {
            let code = bundles[bundleName].code;

            const requireRegExp = new RegExp(
                /(\b(?:require\(|import |from )['"])(@alfalab\/core-components-[^\/\n]+)(['"])/,
            );

            while (requireRegExp.exec(code)) {
                code = code.replace(requireRegExp, `$1$2/${importFrom}$3`);
            }

            bundles[bundleName].code = code;
        });

        return bundles;
    },
});

/**
 * Заменяет импорты компонентов на импорты компонентов нужной темы
 */
export const coreComponentsThemesResolver = () => ({
    name: 'core-components-themes-resolver',
    generateBundle: (opts, bundles) => {
        const { dir } = opts;

        const [_, themeName] = /themes\/(\w+)/.exec(dir);

        const packagesDir = path.join(process.env.LERNA_ROOT_PATH, 'packages');

        Object.keys(bundles).forEach(bundleName => {
            let code = bundles[bundleName].code;

            const requireRegExp = new RegExp(
                /(\b(?:require\(|import |from )['"])(@alfalab\/core-components-([^\/\n]+))(['"]).+/g,
            );

            let match = requireRegExp.exec(code);

            /**
             * Заменяет обычные импорты, например:
             * require('@alfalab/core-components-loader') заменит на
             * require('@alfalab/core-components-loader/dist/themes/:themeName')
             */
            while (match) {
                const componentName = match[3];
                const pkg = require(path.join(packagesDir, componentName, 'package.json'));

                /**
                 * Если у компонента есть нужная тема, то заменяем импорт
                 */
                if (pkg && pkg.buildThemes && pkg.buildThemes.includes(themeName)) {
                    const newImport = match[0].replace(
                        /(.+)(@alfalab\/core-components-[^\/\n\'\"]+)(.+)/,
                        `$1$2/dist/themes/${themeName}$3`,
                    );

                    code = `${code.substring(0, match.index)}${newImport}${code.substring(
                        match.index + match[0].length,
                    )}`;
                }

                match = requireRegExp.exec(code);
            }

            const requireFromDistRegExp = new RegExp(
                /(\b(?:require\(|import |from )['"])(@alfalab\/core-components-([\w\-]+)\/dist)(\/(?!themes).+)(['"]).+/g,
            );

            match = requireFromDistRegExp.exec(code);

            /**
             * Заменяет импорты из modern/cssm/esm, например:
             * require('@alfalab/core-components-loader/dist/esm') заменит на
             * require('@alfalab/core-components-loader/dist/themes/:themeName/esm')
             */
            while (match) {
                const componentName = match[3];
                const pkg = require(path.join(packagesDir, componentName, 'package.json'));

                /**
                 * Если у компонента есть нужная тема, то заменяем импорт
                 */
                if (pkg && pkg.buildThemes && pkg.buildThemes.includes(themeName)) {
                    const newImport = match[0].replace(
                        /(.+)(@alfalab\/core-components-[\w\-]+\/dist)(\/(?!themes).+)/,
                        `$1$2/themes/${themeName}$3`,
                    );

                    code = `${code.substring(0, match.index)}${newImport}${code.substring(
                        match.index + match[0].length,
                    )}`;
                }

                match = requireFromDistRegExp.exec(code);
            }

            bundles[bundleName].code = code;
        });

        return bundles;
    },
});
