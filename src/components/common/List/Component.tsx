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
  align: string;
  className?: string;
}

/**
 * Exp
 */

export const List: React.FC<Props> | any = ({ children, align, className }) => (
  <ul className={cn(styles.list, className, styles[align])}>{children}</ul>
);
