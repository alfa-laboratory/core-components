import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { MaskedInput, MaskedInputProps } from '@alfalab/core-components-masked-input';

import {
    SUPPORTS_INPUT_TYPE_DATE,
    NATIVE_DATE_FORMAT,
    createAutoCorrectedDatePipe,
    parseDateString,
    formatDate,
    mask,
} from './utils';

import styles from './index.module.css';

export type DateInputProps = Omit<MaskedInputProps, 'onBeforeDisplay' | 'mask' | 'onChange'> & {
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

        const pipe = useMemo(
            () =>
                createAutoCorrectedDatePipe({
                    maxYear,
                    minYear,
                }),
            [maxYear, minYear],
        );

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
                const newValue = event.target.value;
                const newDate = parseDateString(newValue);

                changeHandler(event, newValue, newDate);
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
            <MaskedInput
                {...restProps}
                ref={ref}
                mask={mask}
                keepCharPositions={true}
                defaultValue={defaultValue}
                value={inputValue}
                onBeforeDisplay={pipe}
                onChange={handleChange}
                rightAddons={
                    <React.Fragment>
                        <span className={styles.icon} />
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
