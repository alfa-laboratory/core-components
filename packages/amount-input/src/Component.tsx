import cn from 'classnames';
import React, { useState, useEffect, useCallback, forwardRef, Fragment } from 'react';
import { Input, InputProps } from '@alfalab/core-components-input';
import { THINSP, formatAmount, getCurrencySymbol } from '@alfalab/utils';
import { CurrencyCodes } from '@alfalab/data';
import { withSuffix } from '@alfalab/core-components-with-suffix';
import { getFormattedValue, getAmountValueFromStr } from './utils';

import styles from './index.module.css';
import defaultColors from './default.module.css';
import invertedColors from './inverted.module.css';

const colorStyles = {
    default: defaultColors,
    inverted: invertedColors,
};

export type AmountInputProps = Omit<InputProps, 'value' | 'onChange' | 'type'> & {
    /**
     * Денежное значение в минорных единицах
     * Значение null - значит не установлено
     */
    value?: string | number | null;

    /**
     * Валюта
     */
    currency?: CurrencyCodes;

    /**
     * Дополнительный закрепленный текст справа от основного значения. (по умолчанию — символ валюты)
     */
    suffix?: string;

    /**
     * Максимальное число знаков до запятой
     */
    integerLength?: number;

    /**
     * Минорные единицы
     */
    minority?: number;

    /**
     * Позволяет вводить только целые значения
     */
    integersOnly?: boolean;

    /**
     * Жир
     */
    bold?: boolean;

    /**
     * Обработчик события изменения значения
     */
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement>,
        payload: {
            /**
             * Денежное значение в минорных единицах
             * Значение null - значит не установлено
             */
            value: number | null;
            /**
             * Значение инпута
             */
            valueString: string;
        },
    ) => void;
};

/**
 * Инпут, позволяющий закрепить значок валюты
 */
const SuffixInput = withSuffix(Input);

/**
 * Компонент для ввода денежных значений
 */
export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
    (
        {
            value = null,
            integerLength = 9,
            minority = 100,
            currency = 'RUR',
            suffix = currency,
            placeholder = `0\u2009${
                suffix === currency ? getCurrencySymbol(currency) || '' : suffix
            }`,
            integersOnly = false,
            bold = true,
            colors = 'default',
            className,
            focusedClassName,
            dataTestId,
            clear = false,
            onChange,
            onClear,
            ...restProps
        },
        ref,
    ) => {
        const getFormattedAmount = useCallback(() => {
            if (value === '' || value === null) return '';

            return formatAmount({
                value: +value,
                currency,
                minority,
                view: 'default',
            }).formatted;
        }, [currency, minority, value]);

        const [inputValue, setInputValue] = useState<string>(getFormattedAmount());

        const currencySymbol = getCurrencySymbol(currency);

        useEffect(() => {
            const currentAmountValue = getAmountValueFromStr(inputValue, minority);
            if (currentAmountValue !== value) {
                return setInputValue(getFormattedAmount());
            }

            return () => undefined;
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [getFormattedAmount]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const input = e.target;
            let enteredValue = input.value.replace(/\s/g, '').replace('.', ',');

            if (integersOnly) {
                [enteredValue] = enteredValue.split(',');
            }

            const isCorrectEnteredValue = RegExp(
                `(^[0-9]{1,${integerLength}}(,([0-9]+)?)?$|^\\s*$)`,
            ).test(enteredValue);

            if (isCorrectEnteredValue) {
                const newFormattedValue = getFormattedValue(enteredValue, currency, minority);

                if (newFormattedValue === inputValue) {
                    const caret = input.selectionStart;
                    window.requestAnimationFrame(() => {
                        input.selectionStart = caret;
                        input.selectionEnd = caret;
                    });
                } else {
                    /**
                     * Поддержка положения каретки
                     * Поскольку при форматировании введенного значения могут появляться символы типа пробела
                     * или запятая - каретка прыгает в конец и ее необходимо ставить в правильное место
                     */

                    // Узнаем длину оригинального инпута с условием обрезания лишних символов

                    const [head, tail] = input.value.split(/\.|,/);
                    let notFormattedEnteredValueLength = head.length;
                    if (tail) {
                        notFormattedEnteredValueLength += 1; // запятая или точка
                        notFormattedEnteredValueLength += tail.slice(
                            0,
                            minority.toString().length - 1,
                        ).length; // символы в минорной части
                    }

                    const diff = newFormattedValue.length - notFormattedEnteredValueLength;
                    const caret = (input.selectionStart as number) + diff;
                    window.requestAnimationFrame(() => {
                        input.selectionStart = caret;
                        input.selectionEnd = caret;
                    });
                }

                setInputValue(newFormattedValue);
                if (onChange) {
                    onChange(e, {
                        value: getAmountValueFromStr(newFormattedValue, minority),
                        valueString: newFormattedValue,
                    });
                }
            } else {
                // Не двигаем каретку когда вставляется невалидный символ
                const caret = (input.selectionStart as number) - 1;
                window.requestAnimationFrame(() => {
                    input.selectionStart = caret;
                    input.selectionEnd = caret;
                });
            }
        };

        const handleClear = useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                setInputValue('');

                if (onClear) {
                    onClear(event);
                }
            },
            [onClear],
        );

        const [majorPart, minorPart] = inputValue.split(',');

        return (
            <div
                className={cn(styles.container, {
                    [styles.bold]: bold,
                    [styles.filled]: Boolean(inputValue),
                })}
            >
                <SuffixInput
                    {...restProps}
                    suffix={
                        <Fragment>
                            {majorPart}

                            <span className={colorStyles[colors].minorPartAndCurrency}>
                                {minorPart !== undefined && `,${minorPart}`}
                                {THINSP}
                                {suffix === currency ? currencySymbol : suffix}
                            </span>
                        </Fragment>
                    }
                    suffixContainerClassName={styles.suffixContainer}
                    clear={clear}
                    placeholder={placeholder}
                    value={inputValue}
                    colors={colors}
                    className={cn(styles.component, className)}
                    focusedClassName={focusedClassName}
                    inputClassName={styles.input}
                    onChange={handleChange}
                    onClear={handleClear}
                    inputMode='decimal'
                    pattern='[0-9\s\.,]*'
                    dataTestId={dataTestId}
                    ref={ref}
                />
            </div>
        );
    },
);
