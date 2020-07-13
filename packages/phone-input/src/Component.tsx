import React, { useImperativeHandle, useRef } from 'react';
import { conformToMask, TextMaskConfig } from 'text-mask-core';
import { MaskedInput, MaskedInputProps } from '@alfalab/core-components-masked-input';

const mask = [
    '+',
    '7',
    ' ',
    /([0-6]|[8-9])/,
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

export type PhoneInputProps = Omit<MaskedInputProps, 'onBeforeDisplay' | 'type' | 'mask'>;

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ ...restProps }, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);

        // Оставляет возможность прокинуть ref извне
        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        const handleBeforeDisplay = (conformedValue: string, config: TextMaskConfig) => {
            const { rawValue, previousConformedValue, currentCaretPosition } = config;

            /*
             * код ниже нужен для фикса следующих багов библиотеки text-mask:
             * 1) так как код страны указан в маске жестко как "+7",
             * то при удалении цифры перед ним каретку устанавливается перед кодом страны
             * 2) в номере телефона есть пробелы и дефисы,
             * при редактировании цифр рядом с этими символами каретка перескакивает через них,
             * а не остается на том же месте, на котором была до редактирования
             */
            if (
                (previousConformedValue?.length > 1 && [3, 6, 11].includes(currentCaretPosition)) ||
                ([7, 10, 13].includes(currentCaretPosition) &&
                    previousConformedValue.length > currentCaretPosition)
            ) {
                const caret = currentCaretPosition;
                window.requestAnimationFrame(() => {
                    if (inputRef !== null && inputRef.current) {
                        inputRef.current.selectionStart = caret;
                        inputRef.current.selectionEnd = caret;
                    }
                });
            }

            // Удаление цифры перед кодом страны удаляет только саму цифру, код остается ("+7 1" -> "+7 ")
            if (rawValue === '+7 ') {
                return rawValue;
            }

            // Вставка номера с 10 цифрами без кода страны
            if (rawValue.length === 10 && conformedValue.length === mask.length) {
                const masked = conformToMask(`+7${rawValue}`, mask, config);
                return masked.conformedValue;
            }

            // Вставка номера, начинающегося с 8 или 7: 89990313131, 71112223344
            if (
                conformedValue.length === mask.length &&
                (rawValue.startsWith('8') || rawValue.startsWith('7'))
            ) {
                const masked = conformToMask(`+7${rawValue.slice(1)}`, mask, config);
                return masked.conformedValue;
            }

            // Если ввод начат с 7 или 8 - выводит "+7 " и дает продолжить ввод со след. цифры
            if (rawValue.length === 1 && ['7', '8'].includes(rawValue[0])) {
                return '+7 ';
            }

            return conformedValue;
        };

        return (
            <MaskedInput
                {...restProps}
                mask={mask}
                onBeforeDisplay={handleBeforeDisplay}
                type='tel'
                ref={inputRef}
            />
        );
    },
);
