const path = require('path');
const componentsResolver = require('./utils/componentsResolver');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
                        '@babel/preset-env',
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
                        return (
                            !props.parent.fileName.includes('node_modules') ||
                            props.description.includes('(native prop)')
                        );
                    } else {
                        return true;
                    }
                },
            },
        });
    }

    return rule;
};

module.exports = ({ config }) => ({
    ...config,
    watchOptions: {
        ...config.watchOptions,
        ignored: /__image_snapshots__/
    },
    resolve: {
        plugins: [componentsResolver],
        alias: {
            storybook: path.resolve(__dirname),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    plugins: [
        ...config.plugins,
        new MiniCssExtractPlugin(),
        new OptimizeCSSAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                map: {
                    inline: false,
                    annotation: true,
                },
            },
        }),
    ],

    module: {
        rules: [
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[hash:8].[ext]',
                },
            },
            {
                test: /\.md$/,
                use: ['raw-loader'],
            },
            {
                test: /\.(stories|story)\.mdx$/,
                use: [
                    {
                        loader: 'babel-loader',
                        // may or may not need this line depending on your app's setup
                        options: {
                            plugins: ['@babel/plugin-transform-react-jsx'],
                            presets: ['@babel/preset-env'],
                        },
                    },
                    {
                        loader: '@mdx-js/loader',
                        options: {
                            compilers: [createCompiler({})],
                        },
                    },
                ],
            },
            {
                test: /\.(stories|story)\.[tj]sx?$/,
                loader: require.resolve('@storybook/source-loader'),
                exclude: [/node_modules/],
                enforce: 'pre',
            },
            getBabelRules({
                mode: config.mode,
                withRDTL: process.env.RDTL !== 'off',
            }),
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                ],
                exclude: [/node_modules\/core-js/],
            },
            {
                test: /\.css$/,
                exclude: /global/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]',
                            },
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
