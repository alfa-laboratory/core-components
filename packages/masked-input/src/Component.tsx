import React, { useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import { createTextMaskInputElement, TextMaskConfig, TextMaskInputElement } from 'text-mask-core';
import { Input, InputProps } from '@alfalab/core-components-input';

export type MaskedInputProps = Omit<InputProps, 'value'> & {
    /**
     * Значение поля
     */
    value?: string;

    /**
     * Маска для поля ввода
     * https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#mask-array
     */
    mask?: TextMaskConfig['mask'];

    /**
     * Дает возможность изменить значение поля перед рендером
     */
    onBeforeDisplay?: TextMaskConfig['pipe'];
};

// Символ плейсхолдера не может входить в маску, поэтому вместо пробела используется \u2000
export const PLACEHOLDER_CHAR = '\u2000';

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
    ({ mask, value, onBeforeDisplay, onChange, ...restProps }, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const textMask = useRef<TextMaskInputElement | null>(null);

        // Оставляет возможность прокинуть реф извне
        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        const handleInputChange = useCallback(
            event => {
                if (textMask.current) textMask.current.update();
                if (onChange) onChange(event);
            },
            [onChange, textMask],
        );

        useEffect(() => {
            if (inputRef.current) {
                textMask.current = createTextMaskInputElement({
                    mask,
                    inputElement: inputRef.current,
                    pipe: onBeforeDisplay,
                    guide: false,
                    keepCharPositions: false,
                    showMask: false,
                    placeholderChar: PLACEHOLDER_CHAR,
                    rawValue: '',
                });
            }
        }, [onBeforeDisplay, mask]);

        useEffect(() => {
            if (textMask.current) {
                textMask.current.update(value);
            }
        }, [textMask, value]);

        return <Input {...restProps} value={value} onChange={handleInputChange} ref={inputRef} />;
    },
);
