import React, { useState, InputHTMLAttributes, useCallback, ChangeEvent } from 'react';
import cn from 'classnames';
import { FormControl } from '@alfalab/core-components-form-control';

import styles from './index.module.css';

export type InputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'value' | 'onChange'
> & {
    /**
     * Значение поля ввода
     */
    value?: string;

    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     * Отображение ошибки
     */
    error?: string | boolean;

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
     * Ref для обертки input
     */
    wrapperRef?: React.MutableRefObject<HTMLDivElement | null>;

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
     * Дополнительный класс для лейбла
     */
    labelClassName?: string;

    /**
     * Обработчик поля ввода
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>, payload: { value: string }) => void;

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
            labelClassName,
            label,
            leftAddons,
            onFocus,
            onBlur,
            onChange,
            rightAddons,
            value,
            wrapperRef,
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
                if (onChange) {
                    onChange(e, { value: e.target.value });
                }

                setFilled(e.target.value !== '');
            },
            [onChange],
        );

        return (
            <FormControl
                ref={wrapperRef}
                className={className}
                labelClassName={labelClassName}
                size={size}
                block={block}
                disabled={disabled}
                filled={filled || focused || !!value}
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
                        {
                            [styles.hasLabel]: label,
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
            </FormControl>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Input.defaultProps = {
    size: 's',
    type: 'text',
    block: false,
};
