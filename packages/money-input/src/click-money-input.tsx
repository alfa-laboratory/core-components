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

export type ClickMoneyInputProps = Omit<
    MoneyInputProps,
    'value' | 'currency' | 'minorUnits' | 'onChange'
> & {
    amount: AmountType;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        payload: { amount: AmountType; value: string },
    ) => void;
};

export const ClickMoneyInput: React.FC<ClickMoneyInputProps> = ({
    amount: { value, currency, minorUnits },
    onChange,
    ...restProps
}) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>, payload: { value: number }) {
        const { value: newValue } = payload;
        if (onChange) {
            onChange(e, {
                amount: {
                    value: newValue,
                    currency,
                    minorUnits,
                },
                value: '',
            });
        }
    }

    return (
        <MoneyInput
            {...restProps}
            value={value}
            currency={currency}
            minorUnits={minorUnits}
            onChange={handleChange}
        />
    );
};
