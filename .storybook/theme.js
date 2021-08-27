import { create } from '@storybook/theming/create';

import { version } from '../package.json';

export default create({
    base: 'light',
    colorPrimary: '#0B1F35',
    colorSecondary: '#EF3124',
    appContentBg: '#fff',
    appBorderColor: 'rgba(11, 31, 53, 0.1)',
    fontBase: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Helvetica, sans-serif',
    fontCode: 'Monaco, Menlo, monospace',
    textColor: '#0B1F35',
    barTextColor: '#6D7986',
    barSelectedColor: '#EF3124',
    inputBg: '#fff',
    inputBorder: '#DBDEE1',
    inputTextColor: '#0B1F35',
    brandTitle: `core-components@${version}`,
    brandImage: 'https://alfabank.ru/api/files/mail_designer/mailz/core-components.svg',
});
