import { configure } from '@storybook/react';
import { addParameters } from '@storybook/react';
import { setThemeStylesInIframeHtmlPage } from './addons/theme-switcher/utils';
import { Example } from './blocks/example';

setThemeStylesInIframeHtmlPage();

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
