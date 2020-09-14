import { addons } from '@storybook/addons';
import alfaTheme from './theme';

import './theme.css';

addons.setConfig({
    theme: alfaTheme,
    sortStoriesByKind: false,
});
