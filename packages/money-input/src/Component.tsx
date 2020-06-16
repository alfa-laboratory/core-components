import cn from 'classnames';
import React, { useState, useEffect } from 'react';
import { Input, InputProps } from '@alfalab/core-components-input';
import { FormControl } from '@alfalab/core-components-form-control';

import { CURRENCY_CODES, THINSP } from './utils/currencyCodes';
import { getFormatedValue, getAmountValueFromStr, formatAmount } from './utils';
import styles from './index.module.css';

export type MoneyInputProps = Omit<InputProps, 'onChange' | 'rightAddons'> & {
    /**
     * Денежное значение в минорных единицах
     */
    value?: number;

    /**
     * Валюта
     */
    currency?: string;

    /**
     * Минорные единицы
     */
    minority?: number;

    /**
     * Жир
     */
    bold?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Обработчик события изменения значения
     */
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement>,
        payload: {
            /**
             * Денежное значение в минорных единицах
             */
            value: number;
            /**
             * Значение инпута
             */
            valueString: string;
        },
    ) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

/**
 * Компонент для ввода денежных значений
 * [Figma](https://www.figma.com/file/KlFOLLkKO8rtvvQE3RXuhq/Click-Library?node-id=532%3A544)
 */
export const MoneyInput: React.FC<MoneyInputProps> = ({
    value = 0,
    minority = 100,
    currency = 'RUR',
    label = 'Сумма',
    bold = true,
    className,
    dataTestId,
    onChange,
    ...restProps
}: MoneyInputProps) => {
    const [inputValue, setInputValue] = useState<string>(value === 0 ? '' : value.toString());
    const currencySymbol = CURRENCY_CODES[currency];

    useEffect(() => {
        const currentAmountValue = getAmountValueFromStr(inputValue, minority);
        if (currentAmountValue !== value) {
            const { majorPart, minorPart } = formatAmount({
                value,
                currency: { code: currency, minority },
            });

            const newFormatedValue = `${majorPart},${minorPart}`;
            return setInputValue(newFormatedValue);
        }

        return () => undefined;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, currency, minority]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredValue = e.target.value.replace(/\s/g, '').replace('.', ',');
        const isCorrectEnteredValue = /(^[0-9]{1,9}(,([0-9]+)?)?$|^\s*$)/.test(enteredValue);

        if (isCorrectEnteredValue) {
            const newFormatedValue = getFormatedValue(enteredValue, currency, minority);

            if (newFormatedValue === inputValue) {
                const caret = e.target.selectionStart;
                const element = e.target;
                window.requestAnimationFrame(() => {
                    element.selectionStart = caret;
                    element.selectionEnd = caret;
                });
            } else {
                /**
                 * Поддержка положения картки
                 * Поскольку при форматировании введенного значения могут появляться символы типа пробела
                 * или запятая - каретка прыгает в конец и ее необходимо ставить в правильное место
                 */

                // Узнаем длину оригинального инпута с условием обрезания лишних символов

                const [head, tail] = e.target.value.split(/\.|,/);
                let notFormattedEnteredValueLength = head.length;
                if (tail) {
                    notFormattedEnteredValueLength += 1; // запятая или точка
                    notFormattedEnteredValueLength += tail.slice(0, 2).length; // только 2 символа в минорной части
                }

                const diff = newFormatedValue.length - notFormattedEnteredValueLength;
                const caret = (e.target.selectionStart as number) + diff;
                const element = e.target;
                window.requestAnimationFrame(() => {
                    element.selectionStart = caret;
                    element.selectionEnd = caret;
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
            const caret = (e.target.selectionStart as number) - 1;
            const element = e.target;
            window.requestAnimationFrame(() => {
                element.selectionStart = caret;
                element.selectionEnd = caret;
            });
        }
    };

    const [head, tail] = inputValue.split(',');

    return (
        <div className={cn({ [styles.bold]: bold })}>
            <FormControl {...restProps} label={label} className={cn(styles.fakeValueWithCurrency)}>
                <div>
                    <span className={styles.major}>{head}</span>
                    {head && (
                        <span className={styles.currency}>
                            {tail !== undefined && `,${tail}`}
                            {THINSP}
                            {currencySymbol}
                        </span>
                    )}
                </div>
            </FormControl>

            <Input
                {...restProps}
                label={label}
                value={inputValue}
                className={cn(styles.component, className)}
                inputClassName={styles.input}
                onChange={handleChange}
                dataTestId={dataTestId}
            />
        </div>
    );
};
