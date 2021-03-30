import React from 'react';
import { getComponent } from './components';
import { parseKnobs, getQueryParam } from './utils';

export const Screenshots = () => {
    const Component = getComponent(
        getQueryParam('package'),
        getQueryParam('component'),
        getQueryParam('subComponent'),
    );

    return Component ? <Component {...parseKnobs()} /> : null;
};

export default {
    title: 'Компоненты',
};
