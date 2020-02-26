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
 * Expo
 */

export type DividerProps = {
  /** Кастомный класс */
  className?: string;
  /** Id компонента для тестов */
  dataTestId?: string;
};

/** Разделитель */
export const Divider: React.FC<DividerProps> = ({ className, dataTestId }) => (
  <hr className={cn(styles.component, className)} data-testid={dataTestId} />
);
