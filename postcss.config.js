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
                'color-mod-function': { unresolved: 'ignore' },
                'custom-properties': false,
            },
        }),
        require('postcss-for')({}),
        require('postcss-each')({}),
        require('postcss-custom-media')({
            importFrom: {
                customMedia: require('./packages/mq/src/mq.json'),
            },
        }),
    ],
};
