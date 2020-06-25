import React from 'react';
import cn from 'classnames';

import { formatAmount } from './utils';
import { AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR, THINSP, CurrencyCodes } from './utils/currencyCodes';

import styles from './index.module.css';

type Props = {
    /**
     * Денежное значение в минорных единицах
     */
    value: number;

    /**
     * Валюта
     */
    currency: CurrencyCodes;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    minority: number;

    // TODO: подумать над описанием
    /**
     * Отображение минорной части, если она нулевая
     */
    hideMinority?: boolean;

    /**
     * Отключает стили
     */
    pure?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

/**
 * Компонент для отображения суммы, согласно следующему гайдлайну:
 * https://design.alfabank.ru/patterns/amount
 */
export const Amount: React.FC<Props> = ({
    value,
    minority,
    currency,
    hideMinority = false,
    pure = false,
    className,
    dataTestId,
}) => {
    const { majorPart, minorPart, currencySymbol } = formatAmount({
        value,
        currency: {
            code: currency,
            minority,
        },
    });

    return (
        <div
            className={cn(styles.component, { [styles.amount]: !pure }, className)}
            data-test-id={dataTestId}
        >
            {majorPart}
            <span className={cn(!pure && styles.minorPart)}>
                {!hideMinority && minorPart && AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR}
                {!hideMinority && minorPart}
                {THINSP}
                {currencySymbol}
            </span>
        </div>
    );
};
