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

interface Props {
  className?: string;
}

/**
 * Exp
 */

export const Row: React.FC<Props> = ({ children, className }) => (
  <div className={cn(styles.container, className)}>{children}</div>
);
