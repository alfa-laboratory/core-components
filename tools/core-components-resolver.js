import path from 'path';

/**
 * Заменяет все импорты кор-компонентов на относительные пути.
 * Используется для сборки агрегирующего пакета.
 */
const coreComponentsResolver = ({ currentPackageDir }) => ({
    name: 'core-components-resolver',
    generateBundle: (_, bundles) => {
        Object.keys(bundles).forEach(bundleName => {
            let code = bundles[bundleName].code;

            const requireRegExp = new RegExp(
                /(\b(?:require\(|import |from )['"])@alfalab\/core-components-(.*?)(['"])/g,
            );

            let matches;
            while ((matches = requireRegExp.exec(code))) {
                const componentName = matches[2];
                const componentDir = bundleName.includes('modern')
                    ? path.join(componentName, 'modern')
                    : componentName;

                const distDir = path.resolve(currentPackageDir, 'dist');
                const bundleAbsPath = path.join(distDir, bundleName);
                const bundleDir = path.dirname(bundleAbsPath);
                const componentRelativePath = path.relative(bundleDir, componentDir);

                code = code.replace(requireRegExp, `$1${componentRelativePath}$3`);
            }

            bundles[bundleName].code = code;
        });

        return bundles;
    },
});

export default coreComponentsResolver;
