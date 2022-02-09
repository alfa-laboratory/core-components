import React from 'react';
import cn from 'classnames';

import { Amount, AmountProps } from '@alfalab/core-components-amount';
import { TextProps, Typography } from '@alfalab/core-components-typography';

import { PayloadProps } from '../../../types/payload.types';

import styles from './index.module.css';

export interface TooltipValueProps {
    amount?: AmountProps;
    entry: PayloadProps;
    text: TextProps;
}

export const TooltipValue: React.FC<TooltipValueProps> = ({ amount, entry, text }) => {
    return (
        <React.Fragment>
            {amount ? (
                <Amount {...amount} value={entry.value} className={cn(styles.amount)} />
            ) : (
                <Typography.Text {...text} className={cn(styles.tooltipValue)}>
                    {entry?.formatter ? entry.formatter(entry.value) : entry.value}
                </Typography.Text>
            )}
        </React.Fragment>
    );
};
