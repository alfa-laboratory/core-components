module.exports = {
    extends: [require.resolve('arui-presets-lint/eslint')],
    overrides: [
        {
            files: ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js'],
            rules: {
                'import/no-extraneous-dependencies': [
                    'error',
                    { devDependencies: true, packageDir: './' },
                ],
            },
        },
    ],
};
