module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./packages/setupTests.ts'],
    globals: {
        'ts-jest': {
            babelConfig: {
                plugins: [
                    '@babel/plugin-proposal-optional-chaining',
                    '@babel/plugin-proposal-nullish-coalescing-operator',
                ],
            },
        },
    },
    moduleNameMapper: {
        '@alfalab/core-components-(.*)$': '<rootDir>/packages/$1/src',
        '\\.css$': 'identity-obj-proxy',
    },
};
