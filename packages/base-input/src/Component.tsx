/* eslint-disable react/jsx-props-no-spreading */

/**
 * Vendor
 */

import React, { useRef, useState } from 'react';
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
    /** */
    onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
    /** Id компонента для тестов */
    dataTestId?: string;
};

/**
 * Expo
 */

export const BaseInput: React.FC<BaseInputProps> = ({
    size='s',
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
    dataTestId,
    ...restProps
}) => {
    const inputRef = useRef(null);
    const [focused, setFocused] = useState(false);
    const [filled, setFilled] = useState(!!value);

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
        setFilled(!!e.target.value);

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
                { label && (
                    <div className={ cn(styles.label) }>
                        { label }
                    </div>
                ) }

                { leftAddons && (
                    <div className={ cn(styles.leftAddons) }>
                        { leftAddons }
                    </div>
                ) }

                <input
                    className={ cn(styles.input, styles[size], inputClassName) }
                    ref={ inputRef }
                    value={ value }
                    placeholder={ placeholder }
                    disabled={ disabled }
                    required={ required }
                    onChange={ handleInputChange }
                    onFocus={ handleInputFocus }
                    onBlur={ handleInputBlur }
                    data-test-id={ dataTestId }
                    // REVIEW: Думаю в данном кейсе это нормальное решение
                    { ...restProps }
                />

                { rightAddons && (
                    <div className={ cn(styles.rightAddons) }>
                        { rightAddons }
                    </div>
                ) }
            </div>

            { children }
        </div>
    );
};
