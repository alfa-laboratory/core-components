import { addons } from '@storybook/addons';
import alfaTheme from './theme';

import '!style-loader!css-loader!postcss-loader!./theme.css';

addons.setConfig({
    theme: alfaTheme,
    sortStoriesByKind: false,
});
