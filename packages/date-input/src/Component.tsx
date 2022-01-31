import React, { ChangeEvent, useCallback, useEffect, useState, forwardRef } from 'react';
import { isValid } from 'date-fns';

import { Input, InputProps } from '@alfalab/core-components-input';

import {
    NATIVE_DATE_FORMAT,
    parseDateString,
    formatDate,
    format,
    isCompleteDateInput,
    isInputDateSupported,
} from './utils';

import styles from './index.module.css';

export type DateInputProps = Omit<InputProps, 'onChange'> & {
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

    /**
     * Обработчик окончания ввода
     */
    onComplete?: (
        event: ChangeEvent<HTMLInputElement>,
        payload: { date: Date; value: string },
    ) => void;
};

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
    (
        {
            mobileMode = 'input',
            defaultValue,
            rightAddons,
            error,
            value: propsValue,
            onChange,
            onComplete,
            ...restProps
        },
        ref,
    ) => {
        const [shouldRenderNative, setShouldRenderNative] = useState(false);

        const [value, setValue] = useState(defaultValue || '');

        const [stateError, setStateError] = useState(
            defaultValue ? !isValid(parseDateString(defaultValue)) : false,
        );

        const handleChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const { value: newValue } = event.target;

                if (/[^\d.]/.test(newValue)) {
                    return;
                }

                const formattedValue = format(newValue);
                const date = parseDateString(formattedValue);

                setValue(formattedValue);
                setStateError(false);

                if (onChange) onChange(event, { date, value: formattedValue });

                if (isCompleteDateInput(formattedValue)) {
                    const valid = isValid(date);

                    if (!valid) {
                        setStateError(true);
                        return;
                    }

                    setStateError(false);

                    if (onComplete) onComplete(event, { date, value: formattedValue });
                }
            },
            [onChange, onComplete],
        );

        const handleNativeInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const newDate = parseDateString(event.target.value, NATIVE_DATE_FORMAT);
                const newValue = event.target.value === '' ? '' : formatDate(newDate);

                setValue(newValue);

                if (onComplete) onComplete(event, { date: newDate, value: newValue });
                if (onChange) onChange(event, { date: newDate, value: newValue });
            },
            [onComplete, onChange],
        );

        useEffect(() => {
            if (mobileMode === 'native' && isInputDateSupported()) {
                setShouldRenderNative(true);
            }
        }, [mobileMode]);

        return (
            <Input
                {...restProps}
                ref={ref}
                defaultValue={defaultValue}
                value={propsValue || value}
                inputMode='numeric'
                pattern='[0-9]*'
                onChange={handleChange}
                placeholder='ДД.ММ.ГГГГ'
                error={error || stateError}
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
