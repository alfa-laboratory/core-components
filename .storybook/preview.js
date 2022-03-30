import { addons } from '@storybook/addons';
import { configure } from '@storybook/react';
import { addParameters } from '@storybook/react';
import { setThemeStylesInIframeHtmlPage } from './addons/theme-switcher/utils';
import { setModeVarsInIframeHtmlPage } from './addons/mode-switcher/utils';
import { setGuidelinesStyles } from './addons/utils';
import { LIVE_EXAMPLES_ADDON_ID } from 'storybook-addon-live-examples';
import theme from 'prism-react-renderer/themes/oceanicNext';

import guidelinesStyles from '!!postcss-loader!./public/guidelines.css';

import alfaTheme from './theme';
import scope from './scope';

setThemeStylesInIframeHtmlPage();
setModeVarsInIframeHtmlPage();

if (window.location.href.includes('guidelines')) {
    setGuidelinesStyles(guidelinesStyles);
}

addons.setConfig({
    [LIVE_EXAMPLES_ADDON_ID]: {
        editorTheme: theme,
        sandboxPath: '/docs/компоненты-песочница--page',
        copyText: ['Скопировать', 'Скопировано'],
        expandText: ['Показать код', 'Скрыть код'],
        shareText: ['Поделиться', 'Поделиться'],
        borderColor: 'var(--color-light-border-secondary)',
        borderRadius: 'var(--border-radius-s)',
        actionBg: 'var(--color-light-bg-primary)',
        actionColor: 'var(--color-light-text-primary)',
        actionAccent: 'var(--color-light-bg-accent)',
        errorsBg: 'var(--color-light-bg-negative-muted)',
        errorsColor: 'var(--color-light-text-accent)',
        fontBase: 'var(--font-family-system)',
        fontCode: 'Monaco, Menlo, monospace',
        fontSizeBase: 16,
        fontSizeCode: 14,
        defaultCanvas: true,
        scope: {
            ...scope,
        },
    },
});

addParameters({
    viewMode: 'docs',
    docs: {
        theme: alfaTheme,
    },
    options: {
        storySort: {
            method: 'alphabetical',
            order: [
                'Гайдлайны',
                [
                    'Начало работы',
                    'Changelog',
                    'FAQ',
                    'Статусы',
                    'Брейкпоинты',
                    'Иконки',
                    'Отступы',
                    'Темизация',
                    'Типографика',
                    'Цвета',
                    'CSS-переменные',
                    'Доступность',
                    ['Что это?'],
                    'Скриншотное тестирование',
                    'Миграция со старых компонентов',
                ],
                'Компоненты',
            ],
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
