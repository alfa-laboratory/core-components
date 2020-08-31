import React, { useEffect, useRef, useCallback, ChangeEvent, useState } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { createTextMaskInputElement, TextMaskConfig, TextMaskInputElement } from 'text-mask-core';
import { Input, InputProps } from '@alfalab/core-components-input';

import styles from './index.module.css';

export type MaskedInputProps = InputProps & {
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
    ({ mask, value, defaultValue, className, onBeforeDisplay, onChange, ...restProps }, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const textMask = useRef<TextMaskInputElement | null>(null);

        const [inputValue, setInputValue] = useState(value || defaultValue || '');
        const [textHidden, setTextHidden] = useState(true);

        const update = useCallback((newValue = '') => {
            if (textMask.current && inputRef.current) {
                textMask.current.update(newValue);
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
                    currentCaretPosition: 0,
                    previousConformedValue: '',
                });
            }
        }, [onBeforeDisplay, mask]);

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
                ref={mergeRefs([ref, inputRef])}
            />
        );
    },
);
