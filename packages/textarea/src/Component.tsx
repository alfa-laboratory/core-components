import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    TextareaHTMLAttributes,
    useImperativeHandle,
} from 'react';
import cn from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import { FormControl } from '@alfalab/core-components-form-control';

import styles from './index.module.css';

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'style'> & {
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
     * Управление автозаполнением компонента
     */
    autocomplete?: boolean;

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
     * Управление возможностью изменения размеров компонента
     */
    resize?: 'vertical' | 'none';

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
            autocomplete = true,
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
            rows = 1,
            ...restProps
        },
        ref,
    ) => {
        const [focused, setFocused] = useState(false);
        const [filled, setFilled] = useState(value !== undefined && value !== '');

        const textareaRef = useRef<HTMLTextAreaElement>(null);

        // Оставляет возможность прокинуть реф извне
        useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

        // Хак, так как react-textarea-autosize перестал поддерживать maxHeight
        useEffect(() => {
            if (autosize && maxHeight && textareaRef.current && textareaRef.current.style) {
                textareaRef.current.style.maxHeight = `${maxHeight}px`;
            }
        }, [textareaRef, autosize, maxHeight]);

        const handleTextareaFocus = useCallback(
            (e: React.FocusEvent<HTMLTextAreaElement>) => {
                setFocused(true);

                if (onFocus) {
                    onFocus(e);
                }
            },
            [onFocus],
        );

        const handleTextareaBlur = useCallback(
            (e: React.FocusEvent<HTMLTextAreaElement>) => {
                setFocused(false);

                if (onBlur) {
                    onBlur(e);
                }
            },
            [onBlur],
        );

        const handleTextareaChange = useCallback(
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setFilled(e.target.value !== '');

                if (onChange) {
                    onChange(e);
                }
            },
            [onChange],
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
            autoComplete: autocomplete === false ? 'off' : 'on',
            disabled,
            onBlur: handleTextareaBlur,
            onFocus: handleTextareaFocus,
            onChange: handleTextareaChange,
            rows,
            'data-test-id': dataTestId,
        };

        return (
            <FormControl
                className={className}
                size={size}
                block={block}
                disabled={disabled}
                filled={filled || focused || !!value}
                focused={focused}
                error={error}
                label={label}
                labelClassName={cn(styles.label, styles[size])}
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
                        value={value}
                        ref={textareaRef}
                    />
                ) : (
                    <textarea
                        {...textareaProps}
                        style={{ maxHeight }}
                        value={value}
                        ref={textareaRef}
                    />
                )}
            </FormControl>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Textarea.defaultProps = {
    autocomplete: true,
    autosize: true,
    size: 's',
    block: false,
    resize: 'none',
};
