/* eslint-disable multiline-comment-style */

// import resolve from '@rollup/plugin-node-resolve';
// import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import multiInput from 'rollup-plugin-multi-input';
import postcss from 'rollup-plugin-postcss';
import path from 'path';

import pkg from './package.json';

const cjs = {
    input: ['src/**/*.{ts,tsx}', '!src/**/*.{test,stories}.tsx'],
    output: [
        {
            dir: 'dist',
            format: 'cjs',
            // plugins: [terser()],
        },
    ],
    plugins: [
        // auto(),
        // resolve(),
        postcss({
            modules: true,
            extract: path.resolve(__dirname, 'dist/index.css'),
            // inject: (cssVariableName, fileId) => {
            //     console.log(cssVariableName, fileId);
            // },
        }),
        typescript(),
        multiInput(),
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
};

export default cjs;
