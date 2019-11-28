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
  level?: number;
  className?: string;
}

/**
 * Settings
 */

const availableLevels = [1, 2, 3, 4, 5, 6];

/**
 * Exp
 */

export const Title: React.FC<Props> = ({ children, className, level = 1 }) => {
  const Component: any = `h${availableLevels.includes[level] ? level : 1}`;

  return (
    <Component
      className={cn(styles.component, className, styles[`level-${level}`])}
    >
      {children}
    </Component>
  );
};
