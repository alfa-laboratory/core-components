/**
 * Vendor
 */

import React from 'react';
import cn from 'classnames';

/**
 * Styles
 */

import styles from './Component.module.css';

/**
 * Types
 */

type BgColorType = 'dark' | 'red';
type SizeType = 's' | 'l';
type ValueType = React.ReactNode | string;

interface Props {
  value: ValueType;
  color: BgColorType;
  size: SizeType;
  className?: string;
}

/**
 * Exp
 */

export const Badge: React.FC<Props> = ({
  value, color, size, className,
}) => (
  <div
    className={cn(className, styles.component, styles[color], styles[size])}
  >
    {value}
  </div>
);
