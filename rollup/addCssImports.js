import path from 'path';

export const addCssImports = ({ currentPackageDir }) => {
    return {
        name: 'add-css-imports',
        generateBundle: (options, bundles) => {
            Object.keys(bundles).forEach(bundleName => {
                let { code } = bundles[bundleName];
                const cssFilePathRegExp = new RegExp(/\/\/css-file-path: .{1,}/g);
                const searchResult = code.match(cssFilePathRegExp);

                if (searchResult && searchResult.length) {
                    searchResult.forEach(match => {
                        const cssFileName = match.replace(/\/\/css-file-path: /, '');
                        const distDir = path.resolve(currentPackageDir, 'dist');
                        const bundleAbsPath = path.join(distDir, bundleName);
                        const bundleDir = path.dirname(bundleAbsPath);
                        const cssRelativePath = path.relative(bundleDir, cssFileName);

                        code = code.replace(
                            new RegExp(/\/\/css-file-path: .{1,}/),
                            `require('./${cssRelativePath}')`,
                        );
                    });
                }

                /* eslint-disable-next-line no-param-reassign */
                bundles[bundleName].code = code;
            });

            return bundles;
        },
    };
};
