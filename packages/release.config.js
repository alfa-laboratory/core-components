module.exports = {
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        ['@semantic-release/npm', { pkgRoot: './' }],
    ],
    branches: ['master'],
    repositoryUrl: 'https://github.com/alfa-laboratory/core-components',
};
