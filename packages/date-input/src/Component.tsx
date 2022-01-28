import React, {
    ChangeEvent,
    KeyboardEvent,
    useEffect,
    useState,
    forwardRef,
    useRef,
    MouseEventHandler,
    FocusEventHandler,
} from 'react';
import cn from 'classnames';

import { FormControl } from '@alfalab/core-components-form-control';
import { InputProps } from '@alfalab/core-components-input';

import { isInputDateSupported } from './utils';

import styles from './index.module.css';

export type DateInputProps = Omit<InputProps, 'onChange' | 'value' | 'defaultValue'> & {
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

type InputType = 'day' | 'month' | 'year';

/**
 * TODO: сделать более умную валидацию
 */
const validators = {
    day: (value: string) => {
        if (!/^\d?\d?$/.test(value)) {
            return false;
        }

        const int = Number(value);

        return int >= 0 && int <= 31;
    },
    month: (value: string) => {
        if (!/^\d?\d?$/.test(value)) {
            return false;
        }

        const int = Number(value);

        return int >= 0 && int <= 12;
    },
    year: (value: string) => /^\d?\d?\d?\d?$/.test(value),
};

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
    ({ maxYear, minYear, mobileMode = 'input', className, onChange, ...restProps }, ref) => {
        /**
         * TODO: Рендерить native input
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [renderNativeInput, setRenderNativeInput] = useState(false);

        /**
         * TODO: заменить на useReducer
         */
        const [day, setDay] = useState('');
        const [month, setMonth] = useState('');
        const [year, setYear] = useState('');

        const inputRefs = {
            day: useRef<HTMLInputElement>(null),
            month: useRef<HTMLInputElement>(null),
            year: useRef<HTMLInputElement>(null),
        };

        const values = {
            day,
            month,
            year,
        };

        const updateStates = {
            day: setDay,
            month: setMonth,
            year: setYear,
        };

        const focusOnNextInput = (currentInputType: InputType) => {
            if (!inputRefs.month.current || !inputRefs.year.current) {
                return;
            }

            if (currentInputType === 'day') {
                inputRefs.month.current.focus();
            } else if (currentInputType === 'month') {
                inputRefs.year.current.focus();
            }
        };

        const focusOnPrevInput = (currentInputType: InputType) => {
            if (!inputRefs.day.current || !inputRefs.month.current) {
                return;
            }

            if (currentInputType === 'month') {
                inputRefs.day.current.focus();
            } else if (currentInputType === 'year') {
                inputRefs.month.current.focus();
            }
        };

        const validate = (value: string, inputType: InputType) => {
            return validators[inputType](value);
        };

        const updateInputValue = (value: string, inputType: InputType) => {
            updateStates[inputType](value);

            if (value.length === 2) {
                focusOnNextInput(inputType);
            } else if (value.length === 0) {
                focusOnPrevInput(inputType);
            }
        };

        const handleInputChange = (event: ChangeEvent<HTMLInputElement>, inputType: InputType) => {
            const { value } = event.target;

            if (validate(value, inputType)) {
                updateInputValue(value, inputType);
            }
        };

        const handleInputKeyDown = (
            event: KeyboardEvent<HTMLInputElement>,
            inputType: InputType,
        ) => {
            switch (event.key) {
                case 'Backspace':
                    if (values[inputType].length === 0) {
                        // focusOnPrevInput(inputType);
                    }
                    break;
                case 'ArrowRight':
                    if (inputType === 'year') {
                        event.preventDefault();
                    } else {
                        focusOnNextInput(inputType);
                    }
                    break;
                case 'ArrowLeft':
                    if (inputType === 'day') {
                        event.preventDefault();
                    } else {
                        focusOnPrevInput(inputType);
                    }
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    event.preventDefault();
                    break;
            }
        };

        const selectInput = (input: HTMLInputElement) => {
            requestAnimationFrame(() => {
                input.select();
            });
        };

        const handleInputClick: MouseEventHandler = event => {
            selectInput(event.target as HTMLInputElement);
        };

        const handleInputFoucus: FocusEventHandler = event => {
            selectInput(event.target as HTMLInputElement);
        };

        useEffect(() => {
            if (mobileMode === 'native' && isInputDateSupported()) {
                setRenderNativeInput(true);
            }
        }, [mobileMode]);

        return (
            <FormControl {...restProps} ref={ref} className={className}>
                <div className={styles.inner}>
                    <input
                        className={cn(styles.input, styles.inputDay)}
                        placeholder='ДД'
                        value={day}
                        onChange={event => {
                            handleInputChange(event, 'day');
                        }}
                        onClick={handleInputClick}
                        onFocus={handleInputFoucus}
                        onKeyDown={event => {
                            handleInputKeyDown(event, 'day');
                        }}
                        ref={inputRefs.day}
                    />

                    <div className={styles.separator}>.</div>

                    <input
                        className={cn(styles.input, styles.inputMonth)}
                        placeholder='ММ'
                        value={month}
                        onChange={event => {
                            handleInputChange(event, 'month');
                        }}
                        onKeyDown={event => {
                            handleInputKeyDown(event, 'month');
                        }}
                        onClick={handleInputClick}
                        onFocus={handleInputFoucus}
                        ref={inputRefs.month}
                    />

                    <div className={styles.separator}>.</div>

                    <input
                        className={cn(styles.input, styles.inputYear)}
                        placeholder='ГГГГ'
                        value={year}
                        onChange={event => {
                            handleInputChange(event, 'year');
                        }}
                        onKeyDown={event => {
                            handleInputKeyDown(event, 'year');
                        }}
                        onClick={handleInputClick}
                        onFocus={handleInputFoucus}
                        ref={inputRefs.year}
                    />
                </div>
            </FormControl>
        );
    },
);
