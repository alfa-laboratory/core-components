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
                '@babel/preset-react',
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
          {
            loader: require.resolve("react-docgen-typescript-loader"),
            options: {
              tsconfigPath: path.resolve(__dirname, "../tsconfig.storybook.json"),
              propFilter: (props, component) => {
                if (props.parent) {
                    // Показываем только пользовательские пропсы. (Иначе будет простыня из HTMLAttributes)
                    return !props.parent.fileName.includes('node_modules');
                } else {
                    return true;
                }
              }
            }
          }
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
