module.exports = ({ config }) => {
  // Typescript
  config.module.rules.push({
    test: /\.tsx?$/,
    use: [
      'babel-loader',
      'react-docgen-typescript-loader',
      '@storybook/source-loader',
    ],
  });


  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
