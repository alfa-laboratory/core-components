import { ComponentType } from 'react';
import * as dateUtils from 'date-fns';
import * as glyph from '@alfalab/icons-glyph';
import * as knobs from '@storybook/addon-knobs';
import * as grid from './blocks/grid';

const req = require.context(
    '../packages',
    true,
    /^\.\/(.*)\/src\/(index|desktop|mobile|responsive|circle|super-ellipse).ts$/,
);

const isComponent = (component: any) =>
    ['function', 'object'].some(t => typeof component === t) &&
    ['displayName', '$$typeof'].some(p => p in component);

const isComponentsMap = (component: any) =>
    component && Object.values(component).some(isComponent)

const components = req.keys().reduce((acc: Record<string, ComponentType<unknown>>, key) => {
    Object.entries(req(key)).forEach(([componentName, component]: [string, any]) => {
        // if (isComponent(component) || isComponentsMap(component)) {
            acc[componentName] = component;
        // }
    });

    return acc;
}, {});

export default {
    ...components,
    ...grid,
    ...glyph,
    ...dateUtils,
    ...knobs,
};
