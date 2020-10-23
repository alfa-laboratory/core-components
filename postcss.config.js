/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */

const path = require('path');

module.exports = {
    plugins: [
        require('postcss-import')({}),
        require('postcss-mixins')({
            mixinsDir: path.join(__dirname, 'packages/vars/src'),
        }),
        require('postcss-preset-env')({
            stage: 3,
            features: {
                'nesting-rules': true,
                'color-mod-function': { unresolved: 'warn' },
                'custom-properties': false,
            },
        }),
    ],
};
