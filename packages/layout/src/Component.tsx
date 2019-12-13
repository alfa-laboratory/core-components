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
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Exp
 */

export const Layout: React.FC<Props> = ({
  header = null,
  children = null,
  footer = null,
  className = '',
}) => (
  <section className={cn(styles.container, className)}>
    {header && header}
    {children}
    {footer && footer}
  </section>
);
