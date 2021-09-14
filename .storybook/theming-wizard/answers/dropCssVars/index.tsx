import React from 'react';

import { List } from '@alfalab/core-components-list';
import { Link } from '@alfalab/core-components-link';
import { Typography } from '@alfalab/core-components-typography';

import { Example } from 'storybook-addon-live-examples';
import { Answers } from '.storybook/theming-wizard/types';

import { aruiScriptsExample, withoutAruiScriptsExample, darkModeExample } from './utils';

export const DropCssVars = ({ answers }: { answers: Answers }) => {
    const steps = [];

    if (answers.aruiScripts === 'yes' && answers.product !== 'default') {
        steps.push(
            <div key='arui-scripts' style={{ flex: 1 }}>
                <Typography.Text>
                    Подключите тему в{' '}
                    <Link
                        href='https://github.com/alfa-laboratory/arui-scripts/tree/master/packages/arui-scripts#%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B8'
                        view='default'
                        rel='noopener'
                        target='_blank'
                    >
                        настройках
                    </Link>{' '}
                    arui-scripts
                </Typography.Text>
                <Example>{aruiScriptsExample(answers)}</Example>
            </div>,
        );
    }

    if (answers.aruiScripts === 'no') {
        steps.push(
            <div key='without-arui-scripts' style={{ flex: 1 }}>
                <Typography.Text>
                    Настройте плагин{' '}
                    <Link
                        href='https://github.com/postcss/postcss-custom-properties#importfrom'
                        view='default'
                        rel='noopener'
                        target='_blank'
                    >
                        postcss-custom-properties
                    </Link>
                </Typography.Text>
                <Example>{withoutAruiScriptsExample(answers)}</Example>
            </div>,
        );
    }

    if (answers.darkMode === 'yes') {
        steps.push(
            <div key='dark-mode-without-vars' style={{ flex: 1 }}>
                <Typography.Text>
                    Добавьте на страницу дополнительные стили, если темный режим был включен. Обычно
                    это можно сделать в корне приложения.
                </Typography.Text>
                <Example>{darkModeExample(answers)}</Example>
            </div>,
        );
    }

    if (!steps.length) {
        return <Typography.Text>Дополнительных настроек не требуется</Typography.Text>;
    }

    return <List tag='ul'>{steps}</List>;
};
