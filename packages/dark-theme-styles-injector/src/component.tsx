import React, { FC } from 'react';

import colorsIndigo from '@alfalab/core-components-themes/dist/colors/colors-indigo';
import colorsBluetint from '@alfalab/core-components-themes/dist/colors/colors-bluetint';

const colorsMap = {
    indigo: colorsIndigo,
    bluetint: colorsBluetint,
};

export type DarkThemeStylesInjectorProps = {
    /**
     * Какие цвета необходимо инвертировать
     */
    colors: 'indigo' | 'bluetint';

    /**
     * Дополнительные стили для инвертированного режима
     */
    styles?: string;

    /**
     * Селектор, в котором будут переопределяться переменные
     */
    selector?: string;
};

export const DarkThemeStylesInjector: FC<DarkThemeStylesInjectorProps> = ({
    colors,
    styles = '',
    selector = ':root',
}) => {
    return (
        <style>
            {`
                ${selector} {
                    ${colorsMap[colors]}
                }

                ${styles}
            `}
        </style>
    );
};
