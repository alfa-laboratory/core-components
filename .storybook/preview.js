import { configure } from '@storybook/react';
import { addDecorator, addParameters } from '@storybook/react';
import { Example } from './blocks/example';

import withThemeSwitcher from './addons/theme-switcher/index';

addDecorator(withThemeSwitcher);

addParameters({
    viewMode: 'docs',
    docs: {
        components: {
            code: Example,
        },
    },
    options: {
        storySort: {
            method: 'alphabetical',
        },
    },
});

configure(
    [
        require.context('../docs', true, /\.stories\.mdx$/),
        require.context('../packages', true, /\.stories\.(tsx|mdx)$/),
    ],
    module,
);
