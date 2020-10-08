import cn from 'classnames';
import React, { useState, useEffect, useCallback, forwardRef, Fragment } from 'react';
import { Input, InputProps } from '@alfalab/core-components-input';
import { THINSP, formatAmount, getCurrencySymbol } from '@alfalab/utils';
import { CurrencyCodes } from '@alfalab/data';
import { withSuffix } from '@alfalab/core-components-with-suffix';
import { getFormatedValue, getAmountValueFromStr } from './utils';

import styles from './index.module.css';

export type AmountInputProps = Omit<InputProps, 'value' | 'onChange' | 'type'> & {
    /**
     * Денежное значение в минорных единицах
     * Значение null - значит не установлено
     */
    value?: number | null;

    /**
     * Валюта
     */
    currency?: CurrencyCodes;

    /**
     * Минорные единицы
     */
    minority?: number;

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
            minority = 100,
            currency = 'RUR',
            placeholder = `0\u2009${getCurrencySymbol(currency) || ''}`,
            bold = true,
            className,
            dataTestId,
            clear = false,
            onChange,
            onBlur,
            onFocus,
            onClear,
            ...restProps
        },
        ref,
    ) => {
        const [inputValue, setInputValue] = useState<string>(
            formatAmount({
                // TODO: поддержать nullable в utils
                value: value as number,
                currency,
                minority,
            }).formated,
        );

        const currencySymbol = getCurrencySymbol(currency);

        useEffect(() => {
            const currentAmountValue = getAmountValueFromStr(inputValue, minority);
            if (currentAmountValue !== value) {
                return setInputValue(
                    formatAmount({
                        // TODO: поддержать nullable в utils
                        value: value as number,
                        currency,
                        minority,
                    }).formated,
                );
            }

            return () => undefined;
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value, currency, minority]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const input = e.target;
            const enteredValue = input.value.replace(/\s/g, '').replace('.', ',');
            const isCorrectEnteredValue = /(^[0-9]{1,9}(,([0-9]+)?)?$|^\s*$)/.test(enteredValue);

            if (isCorrectEnteredValue) {
                const newFormatedValue = getFormatedValue(enteredValue, currency, minority);

                if (newFormatedValue === inputValue) {
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
                        notFormattedEnteredValueLength += tail.slice(0, 2).length; // только 2 символа в минорной части
                    }

                    const diff = newFormatedValue.length - notFormattedEnteredValueLength;
                    const caret = (input.selectionStart as number) + diff;
                    window.requestAnimationFrame(() => {
                        input.selectionStart = caret;
                        input.selectionEnd = caret;
                    });
                }

                setInputValue(newFormatedValue);
                if (onChange) {
                    onChange(e, {
                        value: getAmountValueFromStr(newFormatedValue, minority),
                        valueString: newFormatedValue,
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

                            <span className={styles.minorPartAndCurrency}>
                                {minorPart !== undefined && `,${minorPart}`}
                                {THINSP}
                                {currencySymbol}
                            </span>
                        </Fragment>
                    }
                    suffixContainerClassName={styles.suffixContainer}
                    clear={clear}
                    placeholder={placeholder}
                    value={inputValue}
                    className={cn(styles.component, className)}
                    inputClassName={styles.input}
                    onChange={handleChange}
                    onClear={handleClear}
                    dataTestId={dataTestId}
                    ref={ref}
                />
            </div>
        );
    },
);
