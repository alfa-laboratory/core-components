const path = require('path');
const getCSSModuleLocalIdent = require('./utils/getCSSModuleLocalIdent');
const componentsResolver = require('./utils/componentsResolver');

/**
 * Добавляет генерацию интерфейсов в зависимости от флага RDTL.
 * @param mode
 * @param withRDTL
 * @returns {{include: [string], test: RegExp, use: [{loader: string, options: {presets: [[string, {modules: boolean}], string, [string, {isTSX: boolean, allExtensions: boolean}]], babelrc: boolean, plugins: [string, string, string], cacheDirectory: boolean}}], exclude: RegExp[]}}
 */
const getBabelRules = ({ mode, withRDTL }) => {
  const rule = {
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: mode === 'development',
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
    ],
    include: [path.resolve('./')],
  };

  if (withRDTL) {
    rule.use.push({
      loader: require.resolve('react-docgen-typescript-loader'),
      options: {
        tsconfigPath: path.resolve(__dirname, '../tsconfig.storybook.json'),
        propFilter: (props, component) => {
          if (props.parent) {
            // Показываем только пользовательские пропсы и пропсы, помеченные как (native prop). (Иначе будет простыня из HTMLAttributes)
            return !props.parent.fileName.includes('node_modules') || props.description.includes('(native prop)');
          } else {
            return true;
          }
        }
      }
    });
  }

  return rule;
};

module.exports = ({ config }) => ({
  ...config,

  resolve: {
    plugins: [componentsResolver],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  module: {
    rules: [
      getBabelRules({
        mode: config.mode,
        withRDTL: process.env.RDTL !== 'off',
      }),
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
                getLocalIdent: getCSSModuleLocalIdent,
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
