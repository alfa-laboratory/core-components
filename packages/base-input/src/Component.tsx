/* eslint-disable react/jsx-props-no-spreading */

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

export type BaseInputProps = {
    /** Размер компонента */
    size?: 's' | 'm' | 'l';
    /** Атрибут type */
    type?: 'number' | 'card' | 'email' | 'file' | 'hidden' | 'money' | 'password' | 'tel' | 'text';
    /** Класс компонента */
    className?: string;
    /** Класс компонента */
    innerClassName?: string;
    /** Класс компонента */
    inputClassName?: string;
    /** Значение поля */
    value?: string;
    /** Плейсхолдер */
    placeholder?: string;
    /** Лейбл компонента */
    label?: React.ReactNode;
    /** Атрибут disabled */
    disabled?: boolean;
    /** Атрибут required */
    required?: boolean;
    /** Слот слева от инпута */
    leftAddons?: React.ReactNode;
    /** Слот справа от инпута */
    rightAddons?: React.ReactNode;
    /** Слот для отображения контента снизу */
    children?: React.ReactNode;
    /** Обработчик фокуса инпута */
    onFocus?: (event?: React.FocusEvent<HTMLInputElement>) => void;
    /** Обработчик блюра инпута */
    onBlur?: (event?: React.FocusEvent<HTMLInputElement>) => void;
    /** Обработчик ввода */
    onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
    /** Id компонента для тестов */
    dataTestId?: string;
};

/**
 * Expo
 */

export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(({
    size='s',
    type='text',
    className,
    innerClassName,
    inputClassName,
    value,
    disabled,
    required,
    placeholder,
    label,
    leftAddons,
    rightAddons,
    children,
    onFocus,
    onBlur,
    onChange,
    dataTestId
}, ref) => {
    const [focused, setFocused] = useState(false);

    const filled = !!value;
    const hasLabel = !!label;

    function handleInputFocus(e: React.FocusEvent<HTMLInputElement>) {
        setFocused(true);

        if (onFocus) {
            onFocus(e);
        }
    }

    function handleInputBlur(e: React.FocusEvent<HTMLInputElement>) {
        setFocused(false);

        if (onBlur) {
            onBlur(e);
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (onChange) {
            onChange(e);
        }
    }

    return (
        <div
            className={ cn(
                styles.component,
                {
                    [styles.focused]: focused,
                    [styles.disabled]: disabled,
                    [styles.filled]: filled,
                    [styles.hasLabel]: hasLabel
                },
                className
            ) }
        >
            <div className={ cn(styles.inner, innerClassName) }>
                { leftAddons && (
                    <div className={ cn(styles.addons, styles.leftAddons) }>
                        { leftAddons }
                    </div>
                ) }


                <div className={ cn(styles.inputWrapper) }>
                    { label && (
                        <div className={ cn(styles.label) }>
                            { label }
                        </div>
                    ) }

                    <input
                        className={ cn(styles.input, styles[size], inputClassName) }
                        ref={ ref }
                        type={ type }
                        value={ value }
                        placeholder={ placeholder }
                        disabled={ disabled }
                        required={ required }
                        onChange={ handleInputChange }
                        onFocus={ handleInputFocus }
                        onBlur={ handleInputBlur }
                        data-test-id={ dataTestId }
                    />
                </div>

                { rightAddons && (
                    <div className={ cn(styles.addons, styles.rightAddons) }>
                        { rightAddons }
                    </div>
                ) }
            </div>

            { children }
        </div>
    );
});
