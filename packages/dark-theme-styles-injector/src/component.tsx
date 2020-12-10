import React, { FC } from 'react';

import colorsIndigo from '@alfalab/core-components-themes/dist/colors/colors-indigo';
import colorsBluetint from '@alfalab/core-components-themes/dist/colors/colors-bluetint';

const colorsMap = {
    indigo: colorsIndigo,
    bluetint: colorsBluetint,
};

export type DarkThemeStylesInjectorProps = {
    colors: 'indigo' | 'bluetint';
    styles?: string;
};

export const DarkThemeStylesInjector: FC<DarkThemeStylesInjectorProps> = ({
    colors,
    styles = '',
}) => {
    return (
        <style>
            {colorsMap[colors]}
            {styles}
        </style>
    );
};
