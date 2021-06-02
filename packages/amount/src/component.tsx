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
    className,
    minorClassName,
    majorBold,
    minorBold,
    minorColor = 'transparent',
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
            className={cn(
                styles.component,
                className,
                /**
                 * Для обратной совместимости.
                 * TODO: Можно будет убрать, после того, как выпилим переменные и все обновятся
                 */
                typeof majorBold === 'boolean' &&
                    (majorBold ? styles.majorBold : styles.majorRegular),
            )}
            data-test-id={dataTestId}
        >
            {majorPart}
            <span
                className={cn(
                    styles.minorPartAndCurrency,
                    minorClassName,
                    minorColor === 'transparent' && styles.minorTransparent,
                    typeof minorBold === 'boolean' &&
                        (minorBold ? styles.minorBold : styles.minorRegular),
                )}
            >
                {minorPart && AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR}
                {minorPart}
                {THINSP}
                {currencySymbol}
            </span>
        </span>
    );
};
