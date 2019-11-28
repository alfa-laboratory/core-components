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

export const Text: React.FC<Props> = ({ children, className }) => (
  <span className={cn(styles.component, className)}>{ children }</span>
);
