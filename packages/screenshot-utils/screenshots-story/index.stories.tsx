import React, { useLayoutEffect } from 'react';
import { getComponent } from './components';
import { parseKnobs, getQueryParam } from './utils';
import { setThemeStylesInIframeHtmlPage } from '../../../.storybook/addons/theme-switcher/utils';

export const Screenshots = () => {
    const Component = getComponent(
        getQueryParam('package'),
        getQueryParam('component'),
        getQueryParam('subComponent'),
    );

    const props = parseKnobs();

    useLayoutEffect(setThemeStylesInIframeHtmlPage, []);

    return (
        <div
            // TODO:
            style={{
                backgroundColor:
                    (props as any).colors === 'inverted'
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
