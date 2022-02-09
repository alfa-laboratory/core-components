import React from 'react';
import cn from 'classnames';

import { TextProps, Typography } from '@alfalab/core-components-typography';

import { PayloadProps } from '../../../types/payload.types';

import styles from './index.module.css';

export interface TooltipNameProps {
    separator?: string;
    entry: PayloadProps;
    text: TextProps;
    list: string[];
}

const addStr = (str: string, index: number, stringToAdd: string) =>
    str.substring(0, index) + stringToAdd + str.substring(index, str.length);

export const TooltipName: React.FC<TooltipNameProps> = ({ separator, entry, text, list }) => {
    const nameIndex = list.indexOf('name');
    const valueIndex = list.indexOf('value');
    const insertIndex =
        nameIndex !== -1 && valueIndex !== 0 && nameIndex > valueIndex ? 0 : entry.name.length;

    return (
        <Typography.Text {...text} className={cn(styles.tooltipName)}>
            {addStr(entry.name, insertIndex, separator ?? ' ')}
        </Typography.Text>
    );
};
