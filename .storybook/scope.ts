import { ComponentType } from 'react';
import * as dateUtils from 'date-fns';
import * as knobs from '@storybook/addon-knobs';
import * as grid from './blocks/grid';

const componentsContext = require.context(
    '../packages',
    true,
    /^\.\/(.*)\/src\/(index|desktop|mobile|responsive|circle|super-ellipse).ts$/,
);

const glyphContext = require.context('../node_modules/@alfalab/icons-glyph', true, /(.*).js$/);

const requireComponents = (context: __WebpackModuleApi.RequireContext) =>
    context.keys().reduce((acc: Record<string, ComponentType<unknown>>, key) => {
        Object.entries(context(key)).forEach(([componentName, component]: [string, any]) => {
            if (['default', '__esModule'].includes(componentName)) return;

            acc[componentName] = component;
        });

        return acc;
    }, {});

export default {
    ...requireComponents(componentsContext),
    ...requireComponents(glyphContext),
    ...grid,
    ...dateUtils,
    ...knobs,
};
