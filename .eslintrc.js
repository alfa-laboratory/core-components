module.exports = {
    extends: [
        require.resolve('arui-presets-lint/eslint'),
        require.resolve('arui-presets-ts/eslint')
    ],
    ignorePatterns: ['node_modules/'],
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    overrides: [{
        files: ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js'],
        rules: {
            'import/no-extraneous-dependencies': 0,
            'react/prop-types': 'off',
        }
    }]
};
