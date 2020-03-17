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

export type PureInputProps = {
  /** Флаг - применять ли стили к компоненту */
  styled?: boolean;
  /** Размер компонента */
  size?: 's' | 'm' | 'l';
  /** Атрибут type */
  type?: 'number' | 'card' | 'email' | 'file' | 'hidden' | 'money' | 'password' | 'tel' | 'text';
  /** Класс компонента */
  className?: string;
  /** Значение поля */
  value?: string;
  /** Плейсхолдер */
  placeholder?: string;
  /** Атрибут disabled */
  disabled?: boolean;
  /** Атрибут required */
  required?: boolean;
  /** Обработчик фокуса инпута */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Обработчик блюра инпута */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Обработчик ввода */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Id компонента для тестов */
  dataTestId?: string;
};

/**
 * Expo
 */

export const PureInput = React.forwardRef<HTMLInputElement, PureInputProps>(({
  styled=true,
  size='s',
  type='text',
  className,
  value,
  disabled,
  required,
  placeholder,
  onFocus,
  onBlur,
  onChange,
  dataTestId
}, ref) => (
  <input
    className={ cn(className, styled && cn(
      styles.component,
      styles[size],
      {
        [styles.disabled]: disabled
      }
    )) }
    ref={ ref }
    type={ type }
    value={ value }
    placeholder={ placeholder }
    disabled={ disabled }
    required={ required }
    onChange={ onChange }
    onFocus={ onFocus }
    onBlur={ onBlur }
    data-test-id={ dataTestId }
  />
));
