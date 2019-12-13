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

export const Paragraph: React.FC<Props> = ({ children, className }) => (
  <p className={cn(styles.component, className)}>{children}</p>
);
