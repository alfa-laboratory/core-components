const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = ({ config }) => {
  // Typescript
  config.module.rules.push({
    test: /\.tsx?$/,
    use: [
      'babel-loader',
      'linaria/loader',
      'react-docgen-typescript-loader',
      '@storybook/source-loader',
    ],
  });

  // Styles
  config.module.rules[2] = {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: process.env.NODE_ENV !== 'production',
        },
      },
      {
        loader: 'css-loader',
        options: { sourceMap: true },
      },
    ],
  };

  config.plugins.push(new MiniCssExtractPlugin({ filename: 'styles.css' }));

  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
