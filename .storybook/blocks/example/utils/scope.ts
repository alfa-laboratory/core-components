import { ComponentType } from 'react';
import * as grid from '../../grid';
import * as glyph from '@alfalab/icons-glyph';

const req = require.context(
    '../../../../packages',
    true,
    /^\.\/(?!dark-theme-styles-injector)(.*)\/src\/(index|desktop|mobile|responsive).ts$/,
);

const isComponent = (component: any) =>
    ['function', 'object'].some(t => typeof component === t) &&
    ['displayName', '$$typeof'].some(p => p in component);

const components = req.keys().reduce((acc: Record<string, ComponentType<unknown>>, key) => {
    Object.entries(req(key)).forEach(([componentName, component]: [string, any]) => {
        if (isComponent(component)) {
            acc[componentName] = component;
        }
    });

    return acc;
}, {});

export default {
    ...components,
    ...grid,
    ...glyph,
};
