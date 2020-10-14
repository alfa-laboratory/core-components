import { ScriptTarget } from 'typescript';
import path from 'path';
import multiInput from 'rollup-plugin-multi-input';
import postcss, { addCssImports } from '@alfalab/rollup-plugin-postcss';
import typescript from 'rollup-plugin-ts';
import stringHash from 'string-hash';
import copy from 'rollup-plugin-copy';

import {
    coreComponentsRootPackageResolver,
    coreComponentsResolver,
} from './tools/rollup/core-components-resolver';
import ignoreCss from './tools/rollup/ignore-css';
import processCss from './tools/rollup/process-css';

const currentPackageDir = process.cwd();
const currentPkg = path.join(currentPackageDir, 'package.json');

const pkg = require(currentPkg);

const currentComponentName = pkg.name.replace('@alfalab/core-components-', '');

const baseConfig = {
    input: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.{test,stories}.{ts,tsx}',
        '!src/**/*.mdx',
        '!src/**/*.d.ts',
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
};

const multiInputPlugin = multiInput();

const postcssPlugin = postcss({
    modules: {
        generateScopedName: function(name, fileName) {
            const folderName = path.basename(path.dirname(fileName));

            const str = `${pkg.name}@${pkg.version}@${folderName}`;

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
            plugins: [
                addCssImports({ currentPackageDir }),
                coreComponentsResolver({ importFrom: 'dist/modern' }),
            ],
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

const cssm = {
    ...baseConfig,
    output: [
        {
            dir: 'dist/cssm',
            format: 'cjs',
            plugins: [coreComponentsResolver({ importFrom: 'dist/cssm' })],
        },
    ],
    plugins: [
        multiInputPlugin,
        ignoreCss(),
        typescript({
            outDir: 'dist/cssm',
            tsconfig: resolvedConfig => ({
                ...resolvedConfig,
                tsBuildInfoFile: 'tsconfig.tsbuildinfo',
            }),
        }),
        processCss(),
    ],
};

const root = {
    input: ['dist/**/*.js'],
    external: baseConfig.external,
    plugins: [
        multiInput({
            relative: 'dist',
        }),
        copy({
            flatten: false,
            targets: [
                { src: ['dist/**/*', '!**/*.js'], dest: `../../dist/${currentComponentName}` },
            ],
        }),
        coreComponentsRootPackageResolver({ currentPackageDir }),
    ],
    output: [
        {
            dir: `../../dist/${currentComponentName}`,
        },
    ],
};

export default [es5, modern, cssm, root];
