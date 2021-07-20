import React, { useImperativeHandle, useCallback, useRef } from 'react';
import { conformToMask, TextMaskConfig } from 'text-mask-core';
import { MaskedInput, MaskedInputProps } from '@alfalab/core-components-masked-input';

import { deleteFormatting, setCaretPosition, getInsertedNumber } from './utils';

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

const countryPrefix = '+7 ';

export type PhoneInputProps = Omit<MaskedInputProps, 'onBeforeDisplay' | 'type' | 'mask'> & {
    clearableCountryCode?: boolean;
};

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ clearableCountryCode = true, ...restProps }, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);

        // Оставляет возможность прокинуть ref извне
        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        const handleBeforeDisplay = useCallback(
            (conformedValue: string, config: TextMaskConfig) => {
                const { rawValue, previousConformedValue, currentCaretPosition } = config;

                /*
                 * код ниже нужен для фикса следующих багов библиотеки text-mask:
                 * 1) так как код страны указан в маске жестко как "+7",
                 * то при удалении цифры перед ним каретка устанавливается перед кодом страны
                 * 2) в номере телефона есть пробелы и дефисы,
                 * при редактировании цифр рядом с этими символами каретка перескакивает через них,
                 * а не остается на том же месте, на котором была до редактирования
                 */
                const previousValueWithoutFormatting = previousConformedValue
                    ? deleteFormatting(previousConformedValue)
                    : '';
                const currentValueWithoutFormatting = deleteFormatting(conformedValue) || '';

                if (
                    previousConformedValue &&
                    (([3, 6].includes(currentCaretPosition) &&
                        Math.abs(
                            previousValueWithoutFormatting.length -
                                currentValueWithoutFormatting.length,
                        ) === 1) ||
                        ([7, 10, 13].includes(currentCaretPosition) &&
                            previousConformedValue.length > currentCaretPosition))
                ) {
                    setCaretPosition({ position: currentCaretPosition, inputRef });
                }

                // Удаление цифры перед кодом страны удаляет только саму цифру, код остается ("+7 1" -> "+7 ")
                if (rawValue === countryPrefix) {
                    return rawValue;
                }

                // Вставка номера с 10 цифрами без кода страны
                if (rawValue.length === 10 && conformedValue.length === mask.length) {
                    const masked = conformToMask(`+7${rawValue}`, mask, config);
                    return masked.conformedValue;
                }

                const insertedNumber = getInsertedNumber({
                    rawValue,
                    clearableCountryCode,
                    countryPrefix,
                    previousConformedValue,
                });

                // Вставка номера, начинающегося с 8 или 7: 89990313131, 71112223344
                if (
                    conformedValue.length === mask.length &&
                    (insertedNumber.startsWith('8') || insertedNumber.startsWith('7'))
                ) {
                    const masked = conformToMask(`+7${insertedNumber.slice(1)}`, mask, config);
                    return masked.conformedValue;
                }

                // Если ввод начат с 7 или 8 - выводит "+7 " и дает продолжить ввод со след. цифры
                if (rawValue.length === 1 && ['7', '8'].includes(rawValue[0])) {
                    return countryPrefix;
                }

                const abortCountryCodeClearing = !clearableCountryCode && !conformedValue;

                if (abortCountryCodeClearing) {
                    setCaretPosition({ position: countryPrefix.length, inputRef });

                    if (!rawValue.length) return countryPrefix;

                    return false;
                }

                return conformedValue;
            },
            [clearableCountryCode],
        );

        return (
            <MaskedInput
                {...restProps}
                defaultValue={clearableCountryCode ? restProps.defaultValue : countryPrefix}
                mask={mask}
                onBeforeDisplay={handleBeforeDisplay}
                type='tel'
                ref={inputRef}
            />
        );
    },
);
