module.exports = {
    plugins: [
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-proposal-class-properties',
        'babel-plugin-array-includes',
    ],
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
};
