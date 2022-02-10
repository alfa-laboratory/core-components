import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useState,
    forwardRef,
    FocusEvent,
    useRef,
} from 'react';

import { Input, InputProps } from '@alfalab/core-components-input';

import mergeRefs from 'react-merge-refs';
import {
    NATIVE_DATE_FORMAT,
    parseDateString,
    formatDate,
    format,
    isCompleteDateInput,
    isInputDateSupported,
    DATE_MASK,
    isValid,
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
            defaultValue = '',
            rightAddons,
            error,
            value: propValue,
            onBlur,
            onChange,
            onComplete,
            ...restProps
        },
        ref,
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);

        const [shouldRenderNative, setShouldRenderNative] = useState(false);

        const [value, setValue] = useState(propValue || defaultValue);

        const [stateError, setStateError] = useState(!isValid(propValue));

        const handleValueValidity = useCallback((inputValue: string) => {
            // Валидируем незаполненное значение только если инпут не в фокусе (блюр, либо установка значения снаружи)
            const validateIncomplete =
                inputRef.current && document.activeElement !== inputRef.current;

            if (!inputValue || validateIncomplete || inputValue.length >= DATE_MASK.length) {
                setStateError(!isValid(inputValue));
            }
        }, []);

        const handleChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const { value: newValue } = event.target;

                // Позволяем вводить только цифры и точки
                if (/[^\d.]/.test(newValue)) {
                    return;
                }

                const dots = newValue.match(/\./g);

                // Не даем вводить больше, чем 2 точки
                if (dots && dots.length > 2) {
                    return;
                }

                // Форматируем введенное значение (добавляем точки)
                const formattedValue = format(newValue);
                const date = parseDateString(formattedValue);

                setValue(formattedValue);

                if (onChange) onChange(event, { date, value: formattedValue });

                if (isCompleteDateInput(formattedValue)) {
                    const valid = formattedValue.length > 0 && isValid(formattedValue);

                    if (!valid) return;

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

        const handleBlur = useCallback(
            (event: FocusEvent<HTMLInputElement>) => {
                handleValueValidity(value);

                if (onBlur) onBlur(event);
            },
            [handleValueValidity, onBlur, value],
        );

        useEffect(() => {
            if (mobileMode === 'native' && isInputDateSupported()) {
                setShouldRenderNative(true);
            }
        }, [mobileMode]);

        useEffect(() => {
            if (typeof propValue !== 'undefined') {
                setValue(propValue);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [propValue]);

        useEffect(() => {
            handleValueValidity(value);
        }, [handleValueValidity, value]);

        return (
            <Input
                {...restProps}
                ref={mergeRefs([ref, inputRef])}
                value={value}
                inputMode='decimal'
                pattern='[0-9\.]*'
                onChange={handleChange}
                onBlur={handleBlur}
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
