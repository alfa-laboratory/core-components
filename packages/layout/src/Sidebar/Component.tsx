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

export const Sidebar: React.FC<Props> = ({ children, className }) => (
  <aside className={cn(styles.container, className)}>{children}</aside>
);
