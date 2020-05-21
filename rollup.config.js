import { ScriptTarget } from 'typescript';
import path from 'path';
import multiInput from 'rollup-plugin-multi-input';
import postcss, { addCssImports } from '@alfalab/rollup-plugin-postcss';
import typescript from 'rollup-plugin-ts';
import stringHash from 'string-hash';

const currentPackageDir = process.cwd();
const currentPkg = path.join(currentPackageDir, 'package.json');

const pkg = require(currentPkg);

const currentComponentName = pkg.name.replace('@alfalab/core-components-', '');

const baseConfig = {
    input: ['src/**/*.{ts,tsx}', '!src/**/*.{test,stories}.tsx', '!src/**/*.mdx'],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
};

const multiInputPlugin = multiInput();

const postcssPlugin = postcss({
    modules: {
        generateScopedName: function(name) {
            const str = `${pkg.name}@${pkg.version}`;

            const hash = stringHash(str)
                .toString(36)
                .substr(0, 5);

            return `${currentComponentName}__${name}_${hash}`;
        },
    },
    extract: true,
    separateCssFiles: true,
});

const es5 = {
    ...baseConfig,
    output: [
        {
            dir: 'dist',
            format: 'cjs',
            plugins: [addCssImports({ currentPackageDir })],
        },
    ],
    plugins: [
        multiInputPlugin,
        typescript({
            tsconfig: resolvedConfig => ({
                ...resolvedConfig,
                tsBuildInfoFile: 'tsconfig.tsbuildinfo',
            }),
        }),
        postcssPlugin,
    ],
};

const modern = {
    ...baseConfig,
    output: [
        {
            dir: 'dist/modern',
            format: 'esm',
            plugins: [addCssImports({ currentPackageDir })],
        },
    ],
    plugins: [
        multiInputPlugin,
        typescript({
            outDir: 'dist/modern',
            tsconfig: resolvedConfig => ({
                ...resolvedConfig,
                target: ScriptTarget.ES2020,
                tsBuildInfoFile: 'tsconfig.tsbuildinfo',
            }),
        }),
        postcssPlugin,
    ],
};

export default [es5, modern];
