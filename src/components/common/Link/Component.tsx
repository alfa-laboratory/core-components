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

export interface Props {
  href: string;
  isActive?: boolean;
  className?: string;
}

export const Link: React.FC<Props> = ({
  children,
  href,
  isActive,
  className = '',
}) => (
  <a
    href={href}
    className={cn(styles.component, className, {
      [styles.active]: isActive,
    })}
  >
    {children}
  </a>
);
