import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';

import withThemeSwitcher from './addons/theme-switcher/index';

addDecorator(withThemeSwitcher);

configure(
    [
        require.context('../docs', true, /\.stories\.mdx$/),
        require.context('../packages', true, /\.stories\.(tsx|mdx)$/),
    ],
    module,
);
