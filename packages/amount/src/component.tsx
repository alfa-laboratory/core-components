import React from 'react';
import cn from 'classnames';

import { formatAmount } from './utils';
import { AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR, THINSP } from './utils/currencyCodes';
import { AmountProps } from './types';
import styles from './index.module.css';

/**
 * Компонент для отображения суммы, согласно следующему гайдлайну:
 * https://design.alfabank.ru/patterns/amount
 */
export const Amount: React.FC<AmountProps> = ({
    value,
    // TODO: "minority" точно надо передавать? может это статичное значение, которое зависит от currency?
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
            <span className={styles.minorPartAndCurrency}>
                {minorPart && AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR}
                {minorPart}
                {THINSP}
                {currencySymbol}
            </span>
        </span>
    );
};
