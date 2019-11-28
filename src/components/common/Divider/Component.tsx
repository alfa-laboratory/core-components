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

export const Divider: React.FC<Props> = ({ className }) => (
  <hr className={cn(styles.component, className)} />
);
