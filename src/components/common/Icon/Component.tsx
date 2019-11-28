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

type SizeType = 'xs' | 'sm' | 'md' | 'lg';
type NameType = 'gear' | 'logout' | 'arrowDown';

interface Props {
  name: NameType;
  size: SizeType;
}

/**
 * Exp
 */

export const Icon: React.FC<Props> = ({ name, size = 's' }) => (
  <span className={cn(styles.icon, styles[name], styles[size])} />
);
