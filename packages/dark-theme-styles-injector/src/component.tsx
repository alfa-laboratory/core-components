import React, { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import colorsIndigo from '@alfalab/core-components-themes/dist/colors/colors-indigo';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
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
