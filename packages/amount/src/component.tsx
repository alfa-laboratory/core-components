import React from 'react';
import cn from 'classnames';
import { formatAmount, AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR, THINSP } from '@alfalab/utils';

import { AmountProps } from './types';
import styles from './index.module.css';

/**
 * Компонент для отображения суммы, согласно следующему гайдлайну:
 * https://design.alfabank.ru/patterns/amount
 */
export const Amount: React.FC<AmountProps> = ({
    value,
    minority,
    currency,
    view = 'default',
    bold = 'major',
    transparentMinor = true,
    className,
    dataTestId,
}) => {
    const { majorPart, minorPart, currencySymbol } = formatAmount({
        value,
        currency,
        minority,
        view,
    });

    return (
        <span
            className={cn(styles.component, className, {
                [styles.bold]: bold === 'full',
                [styles.boldMajor]: bold === 'major',
            })}
            data-test-id={dataTestId}
        >
            {majorPart}
            <span
                className={cn(styles.minorPartAndCurrency, {
                    [styles.transparentMinor]: transparentMinor,
                    [styles.normalMinor]: bold === 'major',
                })}
            >
                {minorPart && AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR}
                {minorPart}
                {THINSP}
                {currencySymbol}
            </span>
        </span>
    );
};
