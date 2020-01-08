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
  THINSP,
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
  currency,
  minority,
  hideMinority = false,

  className,
  minorityClassName,
}) => {
  let { majorPart, minorPart, currencySymbol } = formatAmount(value);

  return (
    <div className={className}>
      {minorPart}
      {AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR}

      {!hideMinority && <span className={minorityClassName}>{majorPart}</span>}
      <span>
        {THINSP}
        {currencySymbol}
      </span>
    </div>
  );
};
