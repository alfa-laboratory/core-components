import path from 'path';
// import typescript from '@rollup/plugin-typescript';
import multiInput from 'rollup-plugin-multi-input';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-ts';

import { addCssImports } from './addCssImports';

const currentPackageDir = process.cwd();
const currentPkg = path.join(currentPackageDir, 'package.json');

const pkg = require(currentPkg);

const baseConfig = {
    input: ['src/**/*.{ts,tsx}', '!src/**/*.{test,stories}.tsx', '!src/**/*.mdx'],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
};

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
            plugins: [addCssImports({ currentPackageDir })],
        },
    ],
    plugins: [
        multiInput(),
        typescript({
            outDir: 'dist/modern',
            target: 'es2020',
        }),
        postcss({
            modules: true,
            extract: true,
            separateCssFiles: true,
        }),
    ],
};

export default [es5, modern];
