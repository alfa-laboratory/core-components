/**
 * Vendor
 */

import React from 'react';

/**
 * Utils
 */

import { formatAmount } from '../../utils';

/**
 * Config
 */

import {
    AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR,
    THINSP, CURRENCY_CODES
} from '../../configs/currencyCodes';

/**
 * Types
 */

type Props = {
  value: number;
  currency: string;
  minority: number;
  hideMinority?: boolean;

  className?: string;
  minorityClassName?: string;
};

/**
 * Exp
 */

export const Amount: React.FC<Props> = ({
    value,
    minority,
    hideMinority = false,

    className,
    minorityClassName
}) => {
    const { majorPart, minorPart, currencySymbol } = formatAmount({
        value,
        currency: {
            code: CURRENCY_CODES.RUR, // TODO need work
            minority
        }
    });

    return (
        <div className={ className }>
            { majorPart }
            { !hideMinority && minorPart && AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR }

            { !hideMinority && <span className={ minorityClassName }>{ minorPart }</span> }
            <span>
                { THINSP }
                { currencySymbol }
            </span>
        </div>
    );
};
