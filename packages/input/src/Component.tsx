import React, {
    useState,
    InputHTMLAttributes,
    useCallback,
    ChangeEvent,
    Fragment,
    MouseEvent,
    useRef,
    ReactNode,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';
import { Button } from '@alfalab/core-components-button';
import { FormControl } from '@alfalab/core-components-form-control';

import styles from './index.module.css';

export type InputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'onClick' | 'onMouseDown'
> & {
    /**
     * Значение поля ввода
     */
    value?: string;

    /**
     * Начальное значение поля
     */
    defaultValue?: string;

    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Крестик для очистки поля
     */
    clear?: boolean;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l' | 'xl';

    /**
     * Отображение ошибки
     */
    error?: string | boolean;

    /**
     * Отображение иконки успеха
     */
    success?: boolean;

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
    wrapperRef?: React.Ref<HTMLDivElement>;

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
     * Дополнительный класс для поля
     */
    fieldClassName?: string;

    /**
     * Дополнительный класс инпута
     */
    inputClassName?: string;

    /**
     * Дополнительный класс для лейбла
     */
    labelClassName?: string;

    /**
     * Дополнительный класс для аддонов
     */
    addonsClassName?: string;

    /**
     * Класс, который будет установлен при фокусе
     */
    focusedClassName?: string;

    /**
     * Класс, который будет установлен, если в поле есть значение
     */
    filledClassName?: string;

    /**
     * Обработчик поля ввода
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>, payload: { value: string }) => void;

    /**
     * Обработчик нажатия на кнопку очистки
     */
    onClear?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Обработчик клика по полю
     */
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;

    /**
     * Обработчик MouseDown по полю
     */
    onMouseDown?: (event: MouseEvent<HTMLDivElement>) => void;

    /**
     * Обработчик MouseUp по полю
     */
    onMouseUp?: (event: MouseEvent<HTMLDivElement>) => void;

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
            dataTestId,
            clear = false,
            disabled,
            error,
            success,
            hint,
            className,
            fieldClassName,
            inputClassName,
            labelClassName,
            addonsClassName,
            focusedClassName,
            filledClassName,
            label,
            leftAddons,
            onFocus,
            onBlur,
            onChange,
            onClear,
            onClick,
            onMouseDown,
            onMouseUp,
            rightAddons,
            value,
            defaultValue,
            wrapperRef,
            readOnly,
            ...restProps
        },
        ref,
    ) => {
        const uncontrolled = value === undefined;

        const inputRef = useRef<HTMLInputElement>(null);

        const [focusVisible] = useFocus(inputRef, 'keyboard');

        const [focused, setFocused] = useState(false);
        const [stateValue, setStateValue] = useState(defaultValue || '');

        const filled = Boolean(uncontrolled ? stateValue : value);
        // отображаем крестик только для заполненного и активного инпута
        const clearButtonVisible = clear && filled && !disabled && !readOnly;

        const handleInputFocus = useCallback(
            (event: React.FocusEvent<HTMLInputElement>) => {
                if (!readOnly) {
                    setFocused(true);
                }

                if (onFocus) {
                    onFocus(event);
                }
            },
            [onFocus, readOnly],
        );

        const handleInputBlur = useCallback(
            (event: React.FocusEvent<HTMLInputElement>) => {
                setFocused(false);

                if (onBlur) {
                    onBlur(event);
                }
            },
            [onBlur],
        );

        const handleInputChange = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                if (onChange) {
                    onChange(event, { value: event.target.value });
                }

                if (uncontrolled) {
                    setStateValue(event.target.value);
                }
            },
            [onChange, uncontrolled],
        );

        const handleClear = useCallback(
            (event: MouseEvent<HTMLButtonElement>) => {
                if (!clearButtonVisible) return;

                if (uncontrolled) {
                    setStateValue('');
                }

                if (onClear) {
                    onClear(event);
                }

                if (inputRef.current && !focused) {
                    inputRef.current.focus();
                }
            },
            [clearButtonVisible, focused, onClear, uncontrolled],
        );

        const renderRightAddons = () => {
            const addonsVisible = clearButtonVisible || rightAddons || error || success;

            return (
                addonsVisible && (
                    <Fragment>
                        {clearButtonVisible && (
                            <Button
                                type='button'
                                view='ghost'
                                disabled={disabled}
                                aria-label='Очистить'
                                className={styles.clearButton}
                                onClick={handleClear}
                            >
                                <span className={styles.clearIcon} />
                            </Button>
                        )}
                        {error && <span className={styles.errorIcon} />}
                        {success && !error && <span className={styles.successIcon} />}
                        {rightAddons}
                    </Fragment>
                )
            );
        };

        return (
            <FormControl
                ref={wrapperRef}
                className={cn(className, focused && focusedClassName, filled && filledClassName)}
                fieldClassName={cn(fieldClassName, {
                    [styles.focusVisible]: focusVisible,
                })}
                labelClassName={labelClassName}
                addonsClassName={addonsClassName}
                size={size}
                block={block}
                disabled={disabled}
                filled={filled || focused}
                focused={focused}
                error={error}
                label={label}
                hint={hint}
                leftAddons={leftAddons}
                rightAddons={renderRightAddons()}
                bottomAddons={bottomAddons}
                onClick={onClick}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
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
                    ref={mergeRefs([ref, inputRef])}
                    type={type}
                    value={uncontrolled ? stateValue : value}
                    readOnly={readOnly}
                    data-test-id={dataTestId}
                    aria-label={typeof label === 'string' ? label : undefined}
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
