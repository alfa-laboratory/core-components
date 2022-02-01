import React from 'react';
import cn from 'classnames';
import { formatAmount, THINSP } from '@alfalab/utils';

import { AmountProps } from '../types';
import styles from './index.module.css';

/**
 * Компонент для отображения суммы, согласно следующему гайдлайну:
 * https://design.alfabank.ru/patterns/amount
 * Не содержит стилей кроме неразрывности строки
 */
export const PureAmount: React.FC<AmountProps> = ({
    value,
    minority,
    currency,
    rightAddons,
    view = 'default',
    showPlus = false,
    className,
    dataTestId,
}) => {
    const { formatted, currencySymbol } = formatAmount({
        value,
        currency,
        minority,
        view,
    });

    return (
        <span className={cn(styles.component, className)} data-test-id={dataTestId}>
            {showPlus && value > 0 ? '+' : ''}
            {formatted}
            {currency ? `${THINSP}${currencySymbol}` : null}
            {rightAddons}
        </span>
    );
};
