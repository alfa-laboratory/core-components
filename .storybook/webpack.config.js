const path = require('path');

module.exports = ({ config }) => ({
  ...config,

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: config.mode === 'development',
              presets: [
                '@babel/react',
                [
                  '@babel/preset-typescript',
                  {
                    isTSX: true,
                    allExtensions: true,
                  },
                ],
              ],
            },
          },
          require.resolve('react-docgen-typescript-loader'),
        ],
        include: [path.resolve('./')],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
              },
              localsConvention: 'dashes',
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
    ],
  },
});
