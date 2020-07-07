import React, { useImperativeHandle, useRef } from 'react';
import { conformToMask, TextMaskConfig } from 'text-mask-core';
import { MaskedInput, MaskedInputProps } from '@alfalab/core-components-masked-input';

const defaultMask = [
    '+',
    '7',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
];

export type PhoneInputProps = Omit<MaskedInputProps, 'onBeforeDisplay' | 'type'>;

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ mask = defaultMask, ...restProps }, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);
        console.debug(restProps);

        // Оставляет возможность прокинуть ref извне
        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        const handleBeforeDisplay = (conformedValue: string, config: TextMaskConfig) => {
            const { rawValue } = config;

            // Удаление цифры перед кодом города удаляет только саму цифру, код остается ("+7 1" -> "+7 ")
            if (rawValue === '+7 ') {
                return rawValue;
            }

            // Вставка номера с 10 цифрами без кода (+7 или 8)
            if (
                (conformedValue.length === mask.length ||
                    conformedValue.length + 1 === mask.length) &&
                rawValue.length === 10
            ) {
                const masked = conformToMask(`+7${rawValue}`, mask, config);
                return masked.conformedValue;
            }

            // Вставка номера, начинающегося с 8: 89990313131
            if (conformedValue.length === mask.length && rawValue.startsWith('8')) {
                const masked = conformToMask(`+7${rawValue.slice(1)}`, mask, config);
                return masked.conformedValue;
            }

            // Если ввод начат с 7 или 8 - выводит +7 и дает продолжить ввод со след. цифры
            if (rawValue.length === 1 && ['7', '8'].includes(rawValue[0])) {
                return conformedValue.slice(0, -1);
            }

            return conformedValue;
        };

        return (
            <MaskedInput
                {...restProps}
                mask={mask}
                onBeforeDisplay={handleBeforeDisplay}
                type='tel'
                formNoValidate={true}
                name='phone'
                ref={inputRef}
            />
        );
    },
);
