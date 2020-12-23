import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    TextareaHTMLAttributes,
    ChangeEvent,
} from 'react';
import cn from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';
import { FormControl } from '@alfalab/core-components-form-control';

import styles from './index.module.css';

export type TextareaProps = Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'size' | 'style' | 'value' | 'defaultValue' | 'onChange'
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
     * Слот слева
     */
    leftAddons?: React.ReactNode;

    /**
     * Слот справа
     */
    rightAddons?: React.ReactNode;

    /**
     * Слот под компонентом
     */
    bottomAddons?: React.ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс textarea
     */
    textareaClassName?: string;

    /**
     * Управление возможностью подстраивать высоту компонента под высоту текста
     */
    autosize?: boolean;

    /**
     * Максимальное количество отображаемых строк (работает только вместе с autosize)
     */
    maxRows?: number;

    /**
     * Минимальное количество отображаемых строк (работает только вместе c autosize)
     */
    minRows?: number;

    /**
     * Максимальная высота элемента
     */
    maxHeight?: number;

    /**
     * Управление возможностью изменения размеров компонента (не работает вместе c autosize)
     */
    resize?: 'vertical' | 'none';

    /**
     * Обработчик ввода
     */
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>, payload: { value: string }) => void;

    /**
     * Обработчик события изменения высоты компонента (работает только вместе c autosize)
     */
    onHeightChange?: (height?: number) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            autoComplete = 'on',
            autosize = true,
            size = 's',
            block = false,
            bottomAddons,
            className,
            dataTestId,
            disabled,
            error,
            hint,
            textareaClassName,
            label,
            leftAddons,
            onFocus,
            onBlur,
            onChange,
            onHeightChange,
            rightAddons,
            maxRows,
            minRows,
            maxHeight,
            resize = 'none',
            value,
            defaultValue,
            rows = autosize ? 1 : 3,
            ...restProps
        },
        ref,
    ) => {
        const uncontrolled = value === undefined;

        const textareaRef = useRef<HTMLTextAreaElement>(null);

        const [focused, setFocused] = useState(false);
        const [stateValue, setStateValue] = useState(defaultValue || '');

        const [focusVisible] = useFocus(textareaRef, 'keyboard');

        const filled = Boolean(uncontrolled ? stateValue : value);

        // Хак, так как react-textarea-autosize перестал поддерживать maxHeight
        useEffect(() => {
            if (autosize && maxHeight && textareaRef.current && textareaRef.current.style) {
                textareaRef.current.style.maxHeight = `${maxHeight}px`;
            }
        }, [textareaRef, autosize, maxHeight]);

        const handleTextareaFocus = useCallback(
            (event: React.FocusEvent<HTMLTextAreaElement>) => {
                setFocused(true);

                if (onFocus) {
                    onFocus(event);
                }
            },
            [onFocus],
        );

        const handleTextareaBlur = useCallback(
            (event: React.FocusEvent<HTMLTextAreaElement>) => {
                setFocused(false);

                if (onBlur) {
                    onBlur(event);
                }
            },
            [onBlur],
        );

        const handleTextareaChange = useCallback(
            (event: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (onChange) {
                    onChange(event, { value: event.target.value });
                }

                if (uncontrolled) {
                    setStateValue(event.target.value);
                }
            },
            [onChange, uncontrolled],
        );

        const textareaProps = {
            ...restProps,
            className: cn(
                styles.textarea,
                styles[size],
                {
                    [styles.hasLabel]: label,
                    [styles.filled]: filled,
                    [styles.resizeVertical]: resize === 'vertical',
                },
                textareaClassName,
            ),
            autoComplete,
            disabled,
            onBlur: handleTextareaBlur,
            onFocus: handleTextareaFocus,
            onChange: handleTextareaChange,
            value: uncontrolled ? stateValue : value,
            rows,
            ref: mergeRefs([ref, textareaRef]),
            'data-test-id': dataTestId,
        };

        return (
            <FormControl
                className={cn(className, {
                    [styles.focusVisible]: focusVisible,
                })}
                size={size}
                block={block}
                disabled={disabled}
                filled={filled || focused}
                focused={focused}
                error={error}
                label={label}
                hint={hint}
                leftAddons={leftAddons}
                rightAddons={rightAddons}
                bottomAddons={bottomAddons}
            >
                {autosize ? (
                    <TextareaAutosize
                        {...textareaProps}
                        maxRows={maxRows}
                        minRows={minRows}
                        onHeightChange={onHeightChange}
                    />
                ) : (
                    <textarea {...textareaProps} style={{ maxHeight }} />
                )}
            </FormControl>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Textarea.defaultProps = {
    autoComplete: 'on',
    autosize: true,
    size: 's',
    block: false,
    resize: 'none',
};
