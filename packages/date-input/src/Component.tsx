import React, { ChangeEvent, useCallback, useState } from 'react';
import { Input, InputProps } from '@alfalab/core-components-input';

import {
    SUPPORTS_INPUT_TYPE_DATE,
    NATIVE_DATE_FORMAT,
    parseDateString,
    formatDate,
    format,
    validate,
} from './utils';

import styles from './index.module.css';

export type DateInputProps = Omit<InputProps, 'onChange'> & {
    /**
     * Минимальный год, доступный для ввода
     */
    minYear?: number;

    /**
     * Максимальный год, доступный для ввода
     */
    maxYear?: number;

    /**
     * Управление нативным режимом на мобильных устройствах
     */
    mobileMode?: 'input' | 'native';

    /**
     * Обработчик изменения значения
     */
    onChange?: (
        event: ChangeEvent<HTMLInputElement>,
        payload: { date: Date; value: string },
    ) => void;
};

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
    (
        {
            maxYear,
            minYear,
            mobileMode = 'input',
            value,
            defaultValue,
            rightAddons,
            onChange,
            ...restProps
        },
        ref,
    ) => {
        const uncontrolled = value === undefined;
        const shouldRenderNative = SUPPORTS_INPUT_TYPE_DATE && mobileMode === 'native';

        const [stateValue, setStateValue] = useState(defaultValue);

        const inputValue = uncontrolled ? stateValue : value;

        const changeHandler = useCallback(
            (event: ChangeEvent<HTMLInputElement>, newValue: string, newDate: Date) => {
                if (uncontrolled) {
                    setStateValue(newValue);
                }

                if (onChange) {
                    onChange(event, { date: newDate, value: newValue });
                }
            },
            [onChange, uncontrolled],
        );

        const handleChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const { value: newValue } = event.target;

                if (/[^\d.]/.test(newValue)) {
                    return;
                }

                const formattedValue = format(newValue);

                if (validate(formattedValue)) {
                    changeHandler(event, formattedValue, parseDateString(formattedValue));
                }

                // TODO: handle caret position
            },
            [changeHandler],
        );

        const handleNativeInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const newDate = parseDateString(event.target.value, NATIVE_DATE_FORMAT);
                const newValue = event.target.value === '' ? '' : formatDate(newDate);

                changeHandler(event, newValue, newDate);
            },
            [changeHandler],
        );

        return (
            <Input
                {...restProps}
                ref={ref}
                defaultValue={defaultValue}
                value={inputValue}
                onChange={handleChange}
                rightAddons={
                    <React.Fragment>
                        {rightAddons}
                        {shouldRenderNative && (
                            <input
                                type='date'
                                ref={ref}
                                defaultValue={defaultValue}
                                onChange={handleNativeInputChange}
                                className={styles.nativeInput}
                            />
                        )}
                    </React.Fragment>
                }
            />
        );
    },
);
