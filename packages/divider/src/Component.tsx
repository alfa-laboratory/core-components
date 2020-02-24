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
  /** Ориентация разделителя */
  orientation?: 'horizontal' | 'vertical';
  /** Делает разделитель более толстым */
  accent?: boolean;
  /** Id компонента для тестов */
  dataTestId?: string;
};

/** Разделитель */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  accent = false,
  className,
  dataTestId
}) => (
  <div
    className={cn(className, styles.divider, styles[orientation], {
      [styles.accent]: accent,
      [styles.horizontal]: orientation === 'horizontal',
      [styles.verticat]: orientation === 'vertical'
    })}
    data-testid={dataTestId}
  />
);
