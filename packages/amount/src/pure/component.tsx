import React from 'react';
import cn from 'classnames';
import { formatAmount } from '@alfalab/utils';

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
    view = 'default',
    className,
    dataTestId,
}) => {
    const { formatedWithCurrency } = formatAmount({
        value,
        currency,
        minority,
        view,
    });

    return (
        <span className={cn(styles.component, className)} data-test-id={dataTestId}>
            {formatedWithCurrency}
        </span>
    );
};
