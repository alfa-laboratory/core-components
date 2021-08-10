import React from 'react';

import { List } from '@alfalab/core-components-list';
import { Link } from '@alfalab/core-components-link';
import { Typography } from '@alfalab/core-components-typography';

import { Example } from '../../../blocks/example';

export const DropCssVars = ({
    answers,
}: {
    answers: Record<'product' | 'keepCssVars' | 'darkMode' | 'aruiScripts' | 'ie', string>;
}) => {
    const steps = [];

    if (answers.aruiScripts === 'yes') {
        steps.push(
            <div key='arui-scripts' style={{ flex: 1 }}>
                <Typography.Text>
                    Подключаем тему в{' '}
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
                <Example>
                    {`
"componentsTheme": "./node_modules/@alfalab/core-components/themes/${answers.product}.css",
"keepCssVars": false
`}
                </Example>
            </div>,
        );
    } else {
        steps.push(
            <div key='without-arui-scripts' style={{ flex: 1 }}>
                <Typography.Text>
                    Настраиваем плагин{' '}
                    <Link
                        href='https://github.com/postcss/postcss-custom-properties#importfrom'
                        view='default'
                        rel='noopener'
                        target='_blank'
                    >
                        postcss-custom-properties
                    </Link>
                </Typography.Text>
                <Example>
                    {`
postcssCustomProperties({
    importFrom: "./node_modules/@alfalab/core-components/themes/${answers.product}.css",
    preserve: false
});
`}
                </Example>
            </div>,
        );
    }

    if (answers.darkMode === 'yes') {
        const compiledTheme = `${answers.product}-dark-${
            answers.product === 'mobile' ? 'bluetint' : 'indigo'
        }`;

        steps.push(
            <div key='dark-mode-without-vars' style={{ flex: 1 }}>
                <Typography.Text>
                    Добавьте на страницу дополнительные стили, если темный режим был включен. Обычно
                    это можно сделать в корне приложения.
                </Typography.Text>
                <Example>
                    {`
import darkMode from '@alfalab/core-components/themes/compiled/${compiledTheme}';

<>
    {mode === 'dark' && <style>{darkMode.toString()}</style>}
    {this.renderPage()}
</>
`}
                </Example>
            </div>,
        );
    }

    return <List tag='ul'>{steps}</List>;
};
