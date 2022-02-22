import React from 'react';
import cn from 'classnames';

import { TextProps, Typography } from '@alfalab/core-components-typography';

import { addStr } from '../../../helpers';
import { PayloadProps } from '../../../types/payload.types';

export interface TooltipNameProps {
    separator?: string;
    entry: PayloadProps;
    text: TextProps;
    list: string[];
}

export const TooltipName: React.FC<TooltipNameProps> = ({ separator, entry, text, list }) => {
    const nameIndex = list.indexOf('name');
    const valueIndex = list.indexOf('value');
    const insertIndex =
        nameIndex !== -1 && valueIndex !== 0 && nameIndex > valueIndex ? 0 : entry.name.length;

    return (
        <Typography.Text
            {...text}
            view={text.view ?? 'secondary-large'}
            className={cn(text.className ?? '')}
        >
            {addStr(entry.name, insertIndex, separator ?? ' ')}
        </Typography.Text>
    );
};
