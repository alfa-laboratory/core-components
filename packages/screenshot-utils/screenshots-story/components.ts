const req = require.context(
    '../../',
    true,
    /^\.\/(?!dark-theme-styles-injector)(.*)\/src\/index.ts$/,
);

const packages = req.keys().reduce((acc, key) => {
    const packageName = key.split('/')[1];
    acc[packageName] = req(key);
    return acc;
}, {});

export const getComponent = (packageName: string, componentName: string) =>
    (packages[packageName] || {})[componentName];
