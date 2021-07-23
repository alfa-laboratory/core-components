const path = require('path');
const componentsResolver = require('./utils/componentsResolver');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const cssModuleRegex = /\.module\.css$/;
const cssRegex = /\.css$/;

const addPackagesDir = config => {
    config.module.rules.forEach(rule => {
        if (rule.oneOf) {
            rule.oneOf.forEach(nestedRule => {
                if (nestedRule.loader && nestedRule.loader.includes('babel-loader')) {
                    nestedRule.include.push(`${process.cwd()}/packages`);
                }
            });
        }
    });
};

module.exports = {
    stories: ['../packages/**/*.stories.@(ts|md)x', '../docs/**/*.stories.@(ts|md)x'],
    addons: [
        '@storybook/addon-knobs',
        {
            name: '@storybook/addon-docs',
            options: { transcludeMarkdown: true },
        },
        '@storybook/preset-create-react-app',
        './addons/theme-switcher/register.js',
        './addons/mode-switcher/register.js',
    ],
    webpackFinal: async config => {
        addPackagesDir(config);

        config.resolve = {
            plugins: [componentsResolver],
            alias: {
                storybook: path.resolve(__dirname),
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        };

        config.performance.hints = false;

        const group = config.module.rules.find(rule => rule.oneOf !== undefined);

        const cssRuleIndex = group.oneOf.findIndex(
            rule => rule.test.toString() === cssRegex.toString(),
        );

        const cssModuleRuleIndex = group.oneOf.findIndex(
            rule => rule.test.toString() === cssModuleRegex.toString(),
        );

        group.oneOf[cssRuleIndex] = {
            test: /\.css$/,
            exclude: cssModuleRegex,
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
                        importLoaders: 1,
                        sourceMap: true,
                    },
                },
                'postcss-loader',
            ],
        };
        group.oneOf[cssModuleRuleIndex] = {
            test: cssModuleRegex,
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
                'postcss-loader',
            ],
        };

        config.module.rules.push({
            test: /\.tsx?$/,
            use: [
                {
                    loader: require.resolve('react-docgen-typescript-loader'),
                    options: {
                        tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
                    },
                },
            ],
        });

        config.plugins.push(
            new MiniCssExtractPlugin(),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                        annotation: true,
                    },
                },
                cssProcessorPluginOptions: {
                    preset: () => ({
                        plugins: [require('postcss-discard-duplicates')],
                    }),
                },
            }),
        );

        return config;
    },
};
