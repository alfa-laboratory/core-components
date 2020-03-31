module.exports = {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
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
};
