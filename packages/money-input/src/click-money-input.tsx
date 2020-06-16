import React from 'react';

import { MoneyInputProps, MoneyInput } from './Component';

type AmountType = {
    /** Сумма в минорных единицах */
    value: number;
    /** Валюта */
    currency: string;
    /** Минорные единицы */
    minorUnits: number;
};

/**
 * Компонент для ввода денежных значений в Клик
 * В клик средний формат денежных значений такой как описано в AmountType
 */
export type ClickMoneyInputProps = Omit<
    MoneyInputProps,
    'value' | 'currency' | 'minority' | 'onChange'
> & {
    amount: AmountType;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        payload: { amount: AmountType; valueString: string },
    ) => void;
};

export const ClickMoneyInput: React.FC<ClickMoneyInputProps> = ({
    amount: { value, currency, minorUnits },
    onChange,
    ...restProps
}) => {
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>,
        payload: { value: number; valueString: string },
    ) {
        const { value: newValue, valueString } = payload;
        if (onChange) {
            onChange(e, {
                amount: {
                    value: newValue,
                    currency,
                    minorUnits,
                },
                valueString,
            });
        }
    }

    return (
        <MoneyInput
            {...restProps}
            value={value}
            currency={currency}
            minority={minorUnits}
            onChange={handleChange}
        />
    );
};
