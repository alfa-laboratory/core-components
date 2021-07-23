import { configure } from '@storybook/react';
import { addDecorator, addParameters } from '@storybook/react';
import { Example } from './blocks/example';

import withThemeSwitcher from './addons/theme-switcher/index';
import withModeSwitcher from './addons/mode-switcher/index';

addDecorator(withThemeSwitcher);
addDecorator(withModeSwitcher);

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
