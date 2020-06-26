import React from 'react';
import cn from 'classnames';

import { formatAmount } from '../utils';
import { AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR, THINSP } from '../utils/currencyCodes';
import { AmounProps } from '../types';
import styles from './index.module.css';

/**
 * Компонент для отображения суммы, согласно следующему гайдлайну:
 * https://design.alfabank.ru/patterns/amount
 * Не содержит стилей кроме неразрывности строки
 */
export const PureAmount: React.FC<AmounProps> = ({
    value,
    minority,
    currency,
    view = 'default',
    className,
    dataTestId,
}) => {
    const { majorPart, minorPart, currencySymbol } = formatAmount({
        value,
        currency: {
            code: currency,
            minority,
        },
        withZeroMinorPart: view === 'withZeroMinorPart',
    });

    return (
        <span className={cn(styles.component, className)} data-test-id={dataTestId}>
            {majorPart}
            {minorPart && AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR}
            {minorPart}
            {THINSP}
            {currencySymbol}
        </span>
    );
};
