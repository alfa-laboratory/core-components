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
  key?: string;
  className?: string;
}

/**
 * Exp
 */

export const ListItem: React.FC<Props> = ({ className, children }) => (
  <li className={cn(styles.component, className)}>{children}</li>
);
