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
    currencyIcon,
    view = 'default',
    className,
    dataTestId,
}) => {
    const { formatted } = formatAmount({
        value,
        currency,
        minority,
        view,
    });

    return (
        <span className={cn(styles.component, className)} data-test-id={dataTestId}>
            {formatted}
            {THINSP}
            {currencyIcon || currency}
        </span>
    );
};
