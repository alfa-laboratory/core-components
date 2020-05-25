import React, { useState, InputHTMLAttributes, useCallback } from 'react';
import cn from 'classnames';
import { FormField } from '@alfalab/core-components-form-field';

import styles from './index.module.css';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     * Текст ошибки
     */
    error?: string;

    /**
     * Текст подсказки
     */
    hint?: string;

    /**
     * Лейбл компонента
     */
    label?: React.ReactNode;

    /**
     * Атрибут type
     */
    type?: 'number' | 'card' | 'email' | 'money' | 'password' | 'tel' | 'text';

    /**
     * Слот слева
     */
    leftAddons?: React.ReactNode;

    /**
     * Слот справа
     */
    rightAddons?: React.ReactNode;

    /**
     * Слот под инпутом
     */
    bottomAddons?: React.ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс инпута
     */
    inputClassName?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            size = 's',
            type = 'text',
            block = false,
            bottomAddons,
            className,
            dataTestId,
            disabled,
            error,
            hint,
            inputClassName,
            label,
            leftAddons,
            onFocus,
            onBlur,
            onChange,
            rightAddons,
            value,
            ...restProps
        },
        ref,
    ) => {
        const [focused, setFocused] = useState(false);
        const [filled, setFilled] = useState(value !== undefined && value !== '');

        const handleInputFocus = useCallback(
            (e: React.FocusEvent<HTMLInputElement>) => {
                setFocused(true);

                if (onFocus) {
                    onFocus(e);
                }
            },
            [onFocus],
        );

        const handleInputBlur = useCallback(
            (e: React.FocusEvent<HTMLInputElement>) => {
                setFocused(false);

                if (onBlur) {
                    onBlur(e);
                }
            },
            [onBlur],
        );

        const handleInputChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setFilled(e.target.value !== '');

                if (onChange) {
                    onChange(e);
                }
            },
            [onChange],
        );

        return (
            <FormField
                className={className}
                size={size}
                block={block}
                disabled={disabled}
                filled={filled || !!value}
                focused={focused}
                error={error}
                label={label}
                hint={hint}
                leftAddons={leftAddons}
                rightAddons={rightAddons}
                bottomAddons={bottomAddons}
            >
                <input
                    {...restProps}
                    className={cn(
                        styles.input,
                        styles[size],
                        {
                            [styles.hasLabel]: label,
                            [styles.hasInputAddons]: leftAddons || rightAddons,
                        },
                        inputClassName,
                    )}
                    disabled={disabled}
                    onBlur={handleInputBlur}
                    onFocus={handleInputFocus}
                    onChange={handleInputChange}
                    ref={ref}
                    type={type}
                    value={value}
                    data-test-id={dataTestId}
                />
            </FormField>
        );
    },
);
