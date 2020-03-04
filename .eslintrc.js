module.exports = {
  extends: [
    require.resolve('arui-presets-lint/eslint'),
    require.resolve('arui-presets-ts/eslint'),
  ],
  ignorePatterns: ['node_modules/'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js'],
      rules: {
        'import/no-extraneous-dependencies': 0,
        'react/prop-types': 'off',
        'react/jsx-indent': 0,
        'react/jsx-indent-props': 0,
        'react/button-has-type': 'off',
        'react/jsx-props-no-spreading': 'off',
        indent: ['error', 2, { SwitchCase: 1 }],
      },
    },
  ],
};
