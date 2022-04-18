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
    bold,
    transparentMinor,
    rightAddons,
    showPlus = false,
    className,
    dataTestId,
}) => {
    const { majorPart, minorPart, currencySymbol } = formatAmount({
        value,
        currency,
        minority,
        view,
    });

    const defaultStyles = bold === undefined && transparentMinor === undefined;

    return (
        <span
            className={cn(styles.component, className, {
                [styles.bold]: bold === 'full',
                [styles.boldMajor]: bold === 'major',
                [styles.default]: defaultStyles,
            })}
            data-test-id={dataTestId}
        >
            {showPlus && value > 0 ? '+' : ''}
            {majorPart}
            <span
                className={cn(styles.minorPartAndCurrency, {
                    [styles.transparentMinor]: transparentMinor,
                    [styles.normalMinor]: bold === 'major',
                    [styles.defaultMinor]: defaultStyles,
                })}
            >
                {minorPart && AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR}
                {minorPart}
                {currency ? `${THINSP}${currencySymbol}` : null}
                {rightAddons}
            </span>
        </span>
    );
};
