import React from 'react';
import cn from 'classnames';

import { Amount } from '@alfalab/core-components-amount';
import { TextProps, Typography } from '@alfalab/core-components-typography';

import { PayloadProps } from '../../../types/payload.types';
import { SeriaProps } from '../../../types/seria.types';
import { Amount as AmountProp } from '../../../types/tooltip.types';

import styles from './index.module.css';

export interface TooltipValueProps {
    amount?: AmountProp;
    entry: PayloadProps;
    text: TextProps;
    data: SeriaProps;
}

export const TooltipValue: React.FC<TooltipValueProps> = ({ amount, entry, text, data }) => {
    return (
        <React.Fragment>
            {amount ? (
                <Amount
                    {...amount}
                    value={entry.value}
                    currency={data?.properties.amount?.currency ?? 'RUB'}
                    className={cn(styles.amount, amount.className ?? '')}
                />
            ) : (
                <Typography.Text
                    {...text}
                    view={text.view ?? 'primary-medium'}
                    weight={text.weight ?? 'medium'}
                    className={cn(text.className ?? '')}
                >
                    {entry?.formatter ? entry.formatter(entry.value) : entry.value}
                </Typography.Text>
            )}
        </React.Fragment>
    );
};
