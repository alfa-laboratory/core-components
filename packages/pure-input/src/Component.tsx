/**
 * Vendor
 */

import React, { InputHTMLAttributes } from 'react';
import cn from 'classnames';

/**
 * Styles
 */

import styles from './Component.module.css';

/**
 * Types
 */

export type PureInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Размер компонента */
  size?: 's' | 'm' | 'l';
  /** Id компонента для тестов */
  dataTestId?: string;
};

/**
 * Expo
 */

export const PureInput = React.forwardRef<HTMLInputElement, PureInputProps>(({
  size='s',
  type='text',
  className,
  dataTestId,
  ...rest
}, ref) => (
  <input
    // Уберем eslint-disable, как только обновим линтер
    // https://github.com/alfa-laboratory/arui-presets-lint/blob/feat/new-rules/eslint/index.js#L87
    // eslint-disable-next-line react/jsx-props-no-spreading
    { ...rest }
    className={ cn(
      className,
      styles.component,
      styles[size]
    ) }
    ref={ ref }
    type={ type }
    data-test-id={ dataTestId }
  />
));
