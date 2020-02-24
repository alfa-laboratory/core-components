module.exports = {
  extends: [
    require.resolve('arui-presets-lint/eslint'),
    require.resolve('arui-presets-ts/eslint')
  ],
  ignorePatterns: ['node_modules/'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  overrides: [
    {
      files: ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js'],
      rules: {
        'import/no-extraneous-dependencies': 0,
        'react/prop-types': 'off',
        indent: ['error', 2],
        'react/jsx-curly-spacing': [2, { when: 'never', children: true }],
        'react/jsx-indent': [2, 2],
        'react/jsx-indent-props': [2, 2],
        'operator-linebreak': [
          'error',
          'after',
          { overrides: { '?': 'before', ':': 'before' } }
        ],
        'jsx-quotes': ['error', 'prefer-double'],
        'object-curly-newline': [
          'error',
          {
            ObjectExpression: { multiline: true, minProperties: 1 }
          }
        ]
      }
    }
  ]
};
