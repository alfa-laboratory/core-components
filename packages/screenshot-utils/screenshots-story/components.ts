const req = require.context(
    '../../',
    true,
    /^\.\/(.*)\/src\/index.ts$/,
);

const packages = req.keys().reduce((acc, key) => {
    const packageName = key.split('/')[1];
    acc[packageName] = req(key);
    return acc;
}, {});

export const getComponent = (
    packageName: string,
    componentName: string,
    subComponentName?: string,
) => {
    try {
        const component = packages[packageName][componentName];
        return subComponentName ? component[subComponentName] : component;
    } catch (e) {
        return null;
    }
};
