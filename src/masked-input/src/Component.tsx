/**
 * Vendor
 */

import React, { useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import { createTextMaskInputElement } from 'text-mask-core';
import { Input, InputProps } from '../../input/src/Component';

/**
 * Types
 */

type Mask = Array<string | RegExp>;

/* https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md */
type TextMaskConfig = {
    /**
     * Маска для поля ввода
     */
    mask?: Mask | ((rawValue?: string) => Mask);

    /**
     * Если true - отображает маску во время ввода
     */
    guide?: boolean;

    /**
     * Показывать маску, если поле ввода пустое
     */
    showMask?: boolean;

    /**
     * Плейсхолдер для отображения незаполненных символов
     */
    placeholderChar?: string;

    /**
     * Если true - не дает перезаписывать уже введенные символы
     */
    keepCharPositions?: boolean;

    /**
     * Дает возможность изменить значение поле перед рендером
     */
    pipe?: (
        conformedValue?: string,
        config?: TextMaskConfig,
    ) => false | string | { value: string; indexesOfPipedChars: number[] };
};

type TextMask = {
    state: { previousConformedValue: string; previousPlaceholder: string };
    update: (
        rawValue?: string,
        textMaskConfig?: TextMaskConfig & { inputElement: HTMLInputElement },
    ) => void;
};

// prettier-ignore
type MaskedInputProps = Omit<InputProps, 'value'> & TextMaskConfig & {
    value?: string;
};

/**
 * Expo
 */

export const DEFAULT_PLACEHOLDER_CHAR = '\u2000';

export const MaskedInput = React.forwardRef<HTMLInputElement | null, MaskedInputProps>(
    (
        {
            mask,
            guide = false,
            placeholderChar = DEFAULT_PLACEHOLDER_CHAR,
            keepCharPositions = false,
            showMask = false,
            value,
            pipe,
            onChange,
            ...restProps
        },
        ref,
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const textMask = useRef<TextMask | null>(null);

        // Оставляет возможность прокинуть реф извне
        useImperativeHandle(ref, () => inputRef.current);

        const handleInputChange = useCallback(
            event => {
                if (textMask.current) textMask.current.update();
                if (onChange) onChange(event);
            },
            [onChange, textMask],
        );

        useEffect(() => {
            const input = inputRef.current;
            if (input) {
                textMask.current = createTextMaskInputElement({
                    inputElement: inputRef.current,
                    mask,
                    guide,
                    placeholderChar,
                    keepCharPositions,
                    showMask,
                    pipe,
                }) as TextMask;
            }
        }, [placeholderChar, showMask, pipe, mask, guide, keepCharPositions]);

        useEffect(() => {
            if (textMask.current) {
                textMask.current.update(value);
            }
        }, [textMask, value]);

        return <Input {...restProps} value={value} onChange={handleInputChange} ref={inputRef} />;
    },
);
