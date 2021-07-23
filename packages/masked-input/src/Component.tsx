import React, { useEffect, useRef, useCallback, ChangeEvent, useState, MouseEvent } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { createTextMaskInputElement, TextMaskInputElement } from 'text-mask-core';
import { Input, InputProps } from '@alfalab/core-components-input';

import styles from './index.module.css';

// TODO: заставить rollup добавлять кастомные декларации в сборку
type Mask = Array<string | RegExp>;
type TextMaskConfig = {
    currentCaretPosition: number;
    rawValue: string;
    previousConformedValue: string;
    mask?: Mask | ((rawValue: string) => Mask);
    guide?: boolean;
    showMask?: boolean;
    placeholderChar?: string;
    keepCharPositions?: boolean;
    pipe?: (
        conformedValue: string,
        config: TextMaskConfig,
    ) => false | string | { value: string; indexesOfPipedChars: number[] };
};

export type MaskedInputProps = InputProps & {
    /**
     * Маска для поля ввода
     * https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#mask-array
     */
    mask?: TextMaskConfig['mask'];

    /**
     * Управляет поведением компонента при удалении символов
     */
    keepCharPositions?: TextMaskConfig['keepCharPositions'];

    /**
     * Дает возможность изменить значение поля перед рендером
     */
    onBeforeDisplay?: TextMaskConfig['pipe'];
};

// Символ плейсхолдера не может входить в маску, поэтому вместо пробела используется \u2000
export const PLACEHOLDER_CHAR = '\u2000';

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
    (
        {
            mask,
            keepCharPositions = false,
            value,
            defaultValue,
            className,
            onBeforeDisplay,
            onChange,
            onClear,
            ...restProps
        },
        ref,
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const textMask = useRef<TextMaskInputElement | null>(null);

        const [inputValue, setInputValue] = useState(value || defaultValue || '');
        // Не показываем сырое значение до применения маски
        const [textHidden, setTextHidden] = useState(true);

        const update = useCallback((newValue = '') => {
            if (textMask.current && inputRef.current) {
                try {
                    textMask.current.update(newValue);
                } catch (e) {
                    // ignore masking errors
                }

                setInputValue(inputRef.current.value);
            }
        }, []);

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                update(event.target.value);

                if (onChange) {
                    onChange(event, {
                        value: event.target.value,
                    });
                }
            },
            [onChange, update],
        );

        const handleClear = useCallback(
            (event: MouseEvent<HTMLButtonElement>) => {
                update('');
                if (onClear) onClear(event);
            },
            [onClear, update],
        );

        useEffect(() => {
            if (inputRef.current) {
                textMask.current = createTextMaskInputElement({
                    mask,
                    inputElement: inputRef.current,
                    pipe: onBeforeDisplay,
                    guide: false,
                    keepCharPositions,
                    showMask: false,
                    placeholderChar: PLACEHOLDER_CHAR,
                    rawValue: '',
                    currentCaretPosition: 0,
                    previousConformedValue: '',
                });
            }
        }, [onBeforeDisplay, mask, keepCharPositions]);

        useEffect(() => {
            update(value || defaultValue);
        }, [value, update, defaultValue]);

        useEffect(() => {
            setTextHidden(false);
        }, []);

        return (
            <Input
                {...restProps}
                className={cn(className, { [styles.textHidden]: textHidden })}
                value={inputValue}
                onChange={handleInputChange}
                onClear={handleClear}
                ref={mergeRefs([ref, inputRef])}
            />
        );
    },
);
