import { Answer, Question } from './types';

export const config: Question[] = [
    {
        name: 'product',
        title: 'Тема продукта',
        variants: [
            {
                label: 'default',
                value: 'default',
            },
            {
                label: 'click',
                value: 'click',
            },
            {
                label: 'corp',
                value: 'corp',
            },
            {
                label: 'mobile',
                value: 'mobile',
            },
            {
                label: 'site',
                value: 'site',
            },
        ],
    },
    {
        name: 'keepCssVars',
        title: 'CSS-переменные',
        variants: [
            {
                label: 'Оставляем в проде',
                value: 'yes',
            },
            {
                label: 'Выпиливаем',
                value: 'no',
            },
        ],
    },
    {
        name: 'ie',
        title: 'IE11',
        variants: [
            {
                label: 'Поддерживаем',
                value: 'yes',
            },
            {
                label: 'Можем дропнуть',
                value: 'no',
            },
        ],
    },
    {
        name: 'darkMode',
        title: 'Темный режим',
        variants: [
            {
                label: 'Есть',
                value: 'yes',
            },
            {
                label: 'Нет',
                value: 'no',
            },
        ],
    },
    {
        name: 'aruiScripts',
        title: 'arui-scripts',
        variants: [
            {
                label: 'Есть',
                value: 'yes',
            },
            {
                label: 'Нет',
                value: 'no',
            },
        ],
    },
];

export const defaultByProduct: {
    [key: string]: Record<Question['name'], string>;
} = {
    default: {
        product: 'default',
        keepCssVars: 'yes',
        darkMode: 'no',
        aruiScripts: 'yes',
        ie: 'no',
    },
    click: {
        product: 'click',
        keepCssVars: 'yes',
        darkMode: 'no',
        aruiScripts: 'yes',
        ie: 'no',
    },
    mobile: {
        product: 'mobile',
        keepCssVars: 'yes',
        darkMode: 'yes',
        aruiScripts: 'yes',
        ie: 'no',
    },
    site: {
        product: 'site',
        keepCssVars: 'no',
        darkMode: 'no',
        aruiScripts: 'yes',
        ie: 'yes',
    },
    corp: {
        product: 'corp',
        keepCssVars: 'no',
        darkMode: 'no',
        aruiScripts: 'yes',
        ie: 'yes',
    },
};
