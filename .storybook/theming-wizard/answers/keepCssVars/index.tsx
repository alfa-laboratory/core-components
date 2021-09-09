import React from 'react';

import { List } from '@alfalab/core-components-list';
import { Alert } from '@alfalab/core-components-alert';

import { Typography } from '@alfalab/core-components-typography';

import { Example } from 'storybook-addon-live-examples';

export const KeepCssVars = ({
    answers,
}: {
    answers: Record<'product' | 'keepCssVars' | 'darkMode' | 'aruiScripts' | 'ie', string>;
}) => {
    if (answers.keepCssVars === 'yes' && answers.ie === 'yes') {
        return (
            <Alert view='negative'>
                <Typography.Text>
                    К сожалению, IE11 не поддерживает css-переменные, поэтому переменные придется
                    выпиливать.
                </Typography.Text>
            </Alert>
        );
    }

    const steps = [];

    const cssImports = [
        "@import '@alfalab/core-components/vars/index.css';",
        answers.product === 'mobile'
            ? "@import '@alfalab/core-components/vars/colors-bluetint.css';"
            : '',
        `@import '@alfalab/core-components/themes/${answers.product}.css';`,
    ].filter(Boolean);

    steps.push(
        <div key='keepCssVars' style={{ flex: 1 }}>
            <Typography.Text>
                Подключите на проект набор переменных и тему продукта. Обычно это можно сделать в
                одном из корневых файлов проекта:{' '}
                <Typography.Text weight='bold'>App.tsx, root.tsx или app.css</Typography.Text>
            </Typography.Text>
            <Example>{`/* app.css */\n${cssImports.join('\n')}`}</Example>
        </div>,
    );

    if (answers.darkMode === 'yes') {
        steps.push(
            <div key='darkModeWithVars' style={{ flex: 1 }}>
                <Typography.Text>
                    Добавьте на страницу дополнительные стили, если темный режим был включен. Обычно
                    это можно сделать в корне приложения.
                </Typography.Text>
                <Example>
                    {`
import darkMode from '@alfalab/core-components/themes/dark';

<>
    {mode === 'dark' && <style>{darkMode}</style>}
    {this.renderPage()}
</>
`}
                </Example>
            </div>,
        );
    }

    return <List tag='ul'>{steps}</List>;
};
