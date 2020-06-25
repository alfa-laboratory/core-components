import React from 'react';

import { formatAmount } from './utils';
import { AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR, THINSP, CurrencyCodes } from './utils/currencyCodes';

type Props = {
    value: number;
    currency: CurrencyCodes;
    minority: number;
    hideMinority?: boolean;

    className?: string;
    minorityClassName?: string;
    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Amount: React.FC<Props> = ({
    value,
    minority,
    currency,
    hideMinority = false,

    className,
    minorityClassName,
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
        <div className={className} data-test-id={dataTestId}>
            {majorPart}
            {!hideMinority && minorPart && AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR}

            {!hideMinority && <span className={minorityClassName}>{minorPart}</span>}
            <span>
                {THINSP}
                {currencySymbol}
            </span>
        </div>
    );
};
