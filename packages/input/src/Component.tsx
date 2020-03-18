/**
 * Vendor
 */

import React, { useState } from 'react';
import cn from 'classnames';

/**
 * Styles
 */

import styles from './Component.module.css';

/**
 * Types
 */

export type InputProps = {
  /** Класс для контейнеров с аддонами */
  addonsClassName?: string;
  /** Флаг - растягивать инпута на ширину контейнера */
  block?: boolean;
  /** Слот для отображения контента снизу */
  children?: React.ReactNode;
  /** Класс компонента (контейнера) */
  className?: string;
  /** Размер компонента */
  size?: 's' | 'm' | 'l';
  /** Id компонента для тестов */
  dataTestId?: string;
  /** Значение по умолчанию */
  defaultValue?: string;
  /** Атрибут disabled */
  disabled?: boolean;
  /** Текст ошибки */
  error?: string;
  /** Текст подсказки */
  hint?: string;
  /** Атрибут type */
  htmlType?: 'number' | 'card' | 'email' | 'money' | 'password' | 'tel' | 'text';
  /** Класс инпута */
  inputClassName?: string;
  /** Лейбл компонента */
  label?: React.ReactNode;
  /** Слот слева от инпута */
  leftAddons?: React.ReactNode;
  /** Максимальное число символов */
  maxLength?: number;
  /** Обработчик блюра инпута */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Обработчик ввода */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Обработчик фокуса инпута */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Обработчик события нажатия на клавишу клавиатуры в момент, когда фокус находится на компоненте */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Обработчик события отжатия на клавишу клавиатуры в момент, когда фокус находится на компоненте */
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Обработчик события вставки текста в поле */
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  /** Обработчик события прерывания касания по полю */
  onTouchCancel?: (event: React.TouchEvent<HTMLInputElement>) => void;
  /** Обработчик события прекращения касания по полю */
  onTouchEnd?: (event: React.TouchEvent<HTMLInputElement>) => void;
  /** Обработчик события перемещения при касании по полю */
  onTouchMove?: (event: React.TouchEvent<HTMLInputElement>) => void;
  /** Обработчик события касания по полю */
  onTouchStart?: (event: React.TouchEvent<HTMLInputElement>) => void;
  /** Плейсхолдер */
  placeholder?: string;
  /** Атрибут required */
  required?: boolean;
  /** Слот справа от инпута */
  rightAddons?: React.ReactNode;
  /** Последовательность перехода между контролами при нажатии на Tab */
  tabIndex?: number;
  /** Значение поля */
  value?: string;
};

/**
 * Expo
 */

// TODO: Этого не будет, когда появится компонент иконки.
const errorIcon = (
  <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M16.8709 14.432L9.80088 2.61199C9.71724 2.47327 9.59918 2.35852 9.45813 2.27886C9.31709 2.19921 9.15786 2.15735 8.99588 2.15735C8.8339 2.15735 8.67467 2.19921 8.53362 2.27886C8.39258 2.35852 8.27452 2.47327 8.19088 2.61199L1.13088 14.432C1.04895 14.5739 1.00552 14.7347 1.00489 14.8985C1.00426 15.0623 1.04647 15.2235 1.12731 15.366C1.20816 15.5085 1.32484 15.6273 1.46579 15.7108C1.60674 15.7943 1.76707 15.8395 1.93088 15.842H16.0609C16.2259 15.8426 16.3881 15.7993 16.5309 15.7165C16.6736 15.6337 16.7918 15.5145 16.8732 15.3709C16.9546 15.2274 16.9964 15.0648 16.9942 14.8998C16.9921 14.7348 16.9461 14.5733 16.8609 14.432H16.8709ZM9.87088 13.242C9.87088 13.4489 9.7887 13.6473 9.64242 13.7935C9.49614 13.9398 9.29775 14.022 9.09088 14.022H8.86088C8.75845 14.022 8.65702 14.0018 8.56239 13.9626C8.46775 13.9234 8.38177 13.866 8.30934 13.7935C8.23691 13.7211 8.17945 13.6351 8.14025 13.5405C8.10105 13.4458 8.08088 13.3444 8.08088 13.242V13.002C8.08088 12.572 8.43088 12.222 8.86088 12.222H9.13088C9.56188 12.222 9.91088 12.572 9.91088 13.002L9.87088 13.242ZM9.64088 11.242H8.31088L8.09088 5.80199H9.91088L9.64088 11.242Z' fill='#EF3124' />
  </svg>
);

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  size='s',
  htmlType='text',
  block=false,
  addonsClassName,
  children,
  className,
  dataTestId,
  defaultValue,
  disabled,
  error,
  hint,
  inputClassName,
  label,
  leftAddons,
  maxLength,
  onChange,
  onFocus,
  onKeyDown,
  onKeyUp,
  onPaste,
  onTouchCancel,
  onTouchEnd,
  onTouchMove,
  onTouchStart,
  onBlur,
  placeholder,
  required,
  rightAddons,
  tabIndex,
  value
}, ref) => {
  const [focused, setFocused] = useState(false);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);

    if (onFocus) {
      onFocus(e);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);

    if (onBlur) {
      onBlur(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyUp) {
      onKeyUp(e);
    }
  };

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (onPaste) {
      onPaste(e);
    }
  };

  const handleInputTouchCancel = (e: React.TouchEvent<HTMLInputElement>) => {
    if (onTouchCancel) {
      onTouchCancel(e);
    }
  };

  const handleInputTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
    if (onTouchEnd) {
      onTouchEnd(e);
    }
  };

  const handleInputTouchMove = (e: React.TouchEvent<HTMLInputElement>) => {
    if (onTouchMove) {
      onTouchMove(e);
    }
  };

  const handleInputTouchStart = (e: React.TouchEvent<HTMLInputElement>) => {
    if (onTouchStart) {
      onTouchStart(e);
    }
  };

  const rightAddonsRenderer = () => (
    <div className={ cn(styles.addons, addonsClassName) }>
      { error && errorIcon }
      { rightAddons }
    </div>
  );

  const leftAddonsRenderer = () => leftAddons && (
    <div className={ styles.addons }>
      { leftAddons }
    </div>
  );

  return (
    <div
      className={ cn(
        styles.component,
        {
          [styles.focused]: focused,
          [styles.disabled]: disabled,
          [styles.filled]: value,
          [styles.hasLabel]: label,
          [styles.hasError]: error,
          [styles.block]: block
        },
        className
      ) }
    >
      <div className={ styles.inner }>
        { leftAddonsRenderer() }

        <div className={ styles.inputWrapper }>
          { label && (
            <div className={ styles.label }>
              { label }
            </div>
          ) }

          <input
            className={ cn(styles.input, styles[size], inputClassName) }
            defaultValue={ defaultValue }
            disabled={ disabled }
            maxLength={ maxLength }
            onBlur={ handleInputBlur }
            onChange={ handleInputChange }
            onFocus={ handleInputFocus }
            onKeyDown={ handleInputKeyDown }
            onKeyUp={ handleInputKeyUp }
            onPaste={ handleInputPaste }
            onTouchCancel={ handleInputTouchCancel }
            onTouchEnd={ handleInputTouchEnd }
            onTouchMove={ handleInputTouchMove }
            onTouchStart={ handleInputTouchStart }
            placeholder={ placeholder }
            ref={ ref }
            required={ required }
            tabIndex={ tabIndex }
            type={ htmlType }
            value={ value }
            data-test-id={ dataTestId }
          />
        </div>

        { rightAddonsRenderer() }
      </div>

      { (error || hint) && (
        <span className={ styles.sub }>
          { error || hint }
        </span>
      ) }

      { children }
    </div>
  );
});
