/**
 * Vendor
 */

import React from 'react';
import cn from 'classnames';

/**
 * Components
 */

import styles from './Component.module.css';

/**
 * Exp
 */

export const Input: React.FC<{
  className: string;
  onClick(): void;
}> = ({ className }) => {
  return <input className={cn(styles.input, className)} />;
};
