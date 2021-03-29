import React from 'react';
import { getComponent } from './components';
import { parseKnobs, getQueryParam } from './utils';

export const Screenshots = () => {
    const packageName = getQueryParam('package');
    const componentName = getQueryParam('component');
    const Component = getComponent(packageName, componentName);

    return Component ? <Component {...parseKnobs()} /> : null;
};

export default {
    title: 'Компоненты',
};
