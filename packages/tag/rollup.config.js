import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import multiInput from 'rollup-plugin-multi-input';
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json';

function addCssImports() {
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

                        const distDir = path.resolve(__dirname, 'dist');
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
}

const baseConfig = {
    input: ['src/**/*.{ts,tsx}', '!src/**/*.{test,stories}.tsx'],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
};

const es5 = {
    ...baseConfig,
    output: [
        {
            dir: 'dist',
            format: 'cjs',
            plugins: [addCssImports()],
        },
    ],
    plugins: [
        multiInput(),
        typescript(),
        postcss({
            modules: true,
            extract: true,
            separateCssFiles: true,
        }),
    ],
};

const modern = {
    ...baseConfig,
    output: [
        {
            dir: 'dist/modern',
            format: 'esm',
            plugins: [addCssImports()],
        },
    ],
    plugins: [
        multiInput(),
        typescript({
            outDir: 'dist/modern',
            tsconfigOverride: { compilerOptions: { target: 'es2020' } },
        }),
        postcss({
            modules: true,
            extract: true,
            separateCssFiles: true,
        }),
    ],
};

export default [es5, modern];
