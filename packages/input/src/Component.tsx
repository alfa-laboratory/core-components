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
import { Button } from '@alfalab/core-components-button';
import { FormControl } from '@alfalab/core-components-form-control';
import { CrossCircleMIcon } from '@alfalab/icons-glyph';

import styles from './index.module.css';

export type InputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
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
     * Иконка кнопки очистки
     */
    clearIcon?: ReactNode;

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
     * Обработчик нажатия на кнопку очистки
     */
    onClear?: (event: MouseEvent<HTMLButtonElement>) => void;

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
            clear = false,
            clearIcon = <CrossCircleMIcon />,
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
            onClear,
            rightAddons,
            value,
            defaultValue,
            wrapperRef,
            ...restProps
        },
        ref,
    ) => {
        const uncontrolled = value === undefined;

        const inputRef = useRef<HTMLInputElement>(null);

        const [focused, setFocused] = useState(false);
        const [stateValue, setStateValue] = useState(defaultValue || '');

        const filled = Boolean(uncontrolled ? stateValue : value);
        // отображаем крестик только для заполненного и активного инпута
        const clearButtonVisible = Boolean(value || (uncontrolled && stateValue)) && !disabled;

        const handleInputFocus = useCallback(
            (event: React.FocusEvent<HTMLInputElement>) => {
                setFocused(true);

                if (onFocus) {
                    onFocus(event);
                }
            },
            [onFocus],
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
            event => {
                if (!clearButtonVisible) return;

                if (uncontrolled) {
                    setStateValue('');
                }

                if (onClear) {
                    onClear(event);
                }

                if (inputRef.current) {
                    inputRef.current.focus();
                }
            },
            [clearButtonVisible, onClear, uncontrolled],
        );

        const handleFormControlClear = useCallback((event: MouseEvent<HTMLDivElement>) => {
            /**
             * Инпут занимает не весь контрол, из-за этого появляются некликабельные области.
             * Переводим фокус на инпут, если клик был совершен по неинтерактивному элементу.
             */
            const target = event.target as HTMLDivElement;

            if (target.tabIndex < 0 && inputRef.current) {
                inputRef.current.focus();
            }
        }, []);

        const renderRightAddons = () =>
            (clear || rightAddons) && (
                <Fragment>
                    {clear && (
                        <Button
                            view='ghost'
                            onClick={handleClear}
                            leftAddons={clearIcon}
                            disabled={disabled}
                            aria-label='очистить'
                            className={cn(styles.clearButton, {
                                [styles.clearButtonVisible]: clearButtonVisible,
                            })}
                        />
                    )}
                    {rightAddons}
                </Fragment>
            );

        return (
            <FormControl
                ref={wrapperRef}
                className={cn(styles.formControl, className, { [styles.disabled]: disabled })}
                labelClassName={labelClassName}
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
                onClick={handleFormControlClear}
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
                    defaultValue={defaultValue}
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
