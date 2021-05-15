import React from 'react';
import { getComponent } from './components';
import { parseKnobs, getQueryParam } from './utils';

export const Screenshots = () => {
    const Component = getComponent(
        getQueryParam('package'),
        getQueryParam('component'),
        getQueryParam('subComponent'),
    );

    const props = parseKnobs();

    return (
        <div
            // TODO:
            style={{
                backgroundColor: (props as any).inverted
                    ? 'var(--color-light-bg-primary-inverted)'
                    : 'transparent',
            }}
        >
            {Component ? <Component {...props} /> : null}
        </div>
    );
};

export default {
    title: 'Компоненты',
};
