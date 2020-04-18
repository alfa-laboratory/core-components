const path = require('path');

const componentsPrefix = '@alfalab/core-components-';
const componentsDir = path.resolve(__dirname, '../../packages');

/**
 * Локально резолвит импорт @alfalab/core-components.
 * Ищет эти модули не в node_modules, а в папке `componentsDir`
 */
module.exports = componentResolver = {
    apply(resolver) {
        resolver.plugin('module', function(init, callback) {
            if (init.request.startsWith(componentsPrefix)) {
                const componentName = init.request.replace(componentsPrefix, '');

                this.doResolve(
                    'resolve',
                    { ...init, request: `${componentsDir}/${componentName}/src` },
                    `Resolve ${init.request}`,
                    callback,
                );
            } else {
                callback();
            }
        });
    },
};
