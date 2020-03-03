/**
 * Vendor
 */

import React from 'react';
import cn from 'classnames';

/**
 * Styles
 */

import styles from './Component.module.css';
import { BaseInput, BaseInputProps } from '../../base-input/src';

/**
 * Types
 */

type InputProps = BaseInputProps & {
    /** Текст подсказки */
    hint?: 'string';
    /** Текст ошибки */
    error?: 'string';
};

/**
 * Expo
 */

export const Input: React.FC<InputProps> = ({
    size,
    children,
    className,
    innerClassName,
    inputClassName,
    value,
    label,
    placeholder,
    hint,
    error,
    disabled,
    onChange,
    onFocus,
    onBlur,
    dataTestId
}) => {
    const hasHint = !!hint;
    const hasError = !!error;
    const hasSub = hasHint || hasError;

    return (
        <div
            className={ cn(
                styles.component,
                {
                    [styles.hasError]: hasError
                },
                className
            ) }
            data-test-id={ dataTestId }
        >
            <BaseInput
                className={ cn(styles.baseInput) }
                innerClassName={ cn(styles.inner, innerClassName) }
                inputClassName={ cn(styles.input, inputClassName) }
                size={ size }
                value={ value }
                label={ label }
                placeholder={ placeholder }
                disabled={ disabled }
                onChange={ onChange }
                onFocus={ onFocus }
                onBlur={ onBlur }
            >
                { hasSub && (
                    <span className={ cn(styles.sub) }>
                        { (hasHint && !hasError) && hint }
                        { hasError && error }
                    </span>
                ) }
            </BaseInput>
        </div>
    );
};
