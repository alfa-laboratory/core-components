import { addons } from '@storybook/addons';
import alfaTheme from './theme';

addons.setConfig({
    theme: alfaTheme,
    sortStoriesByKind: false,
});
