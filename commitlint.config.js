const {
    utils: { getPackages },
} = require('@commitlint/config-lerna-scopes');

const PACKAGE_NAME_PREFIX_REG_EXP = /^core-components-/;

function deletePackagesPrefix(arr) {
    return arr.map(packageName => packageName.replace(PACKAGE_NAME_PREFIX_REG_EXP, ''));
}

module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'scope-enum': async ctx =>
          [2, 'always', [...(deletePackagesPrefix(await getPackages(ctx)))]],
    },
};
