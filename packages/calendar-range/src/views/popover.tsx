import React, { useCallback, useState, FC, useEffect } from 'react';
import cn from 'classnames';
import { startOfMonth } from 'date-fns';
import {
    CalendarInput,
    CalendarInputProps,
    isValidInputValue,
    parseDateString,
} from '@alfalab/core-components-calendar-input';
import { isCompleteDateInput } from '@alfalab/core-components-date-input';

import { CalendarRangeProps } from '../Component';
import { usePopoverViewMonthes } from '../hooks';

import styles from './index.module.css';

export type CalendarRangePopoverProps = Omit<CalendarRangeProps, 'calendarPosition'>;

export const CalendarRangePopover: FC<CalendarRangePopoverProps> = ({
    className,
    defaultMonth = startOfMonth(new Date()).getTime(),
    minDate,
    maxDate,
    valueFrom = '',
    valueTo = '',
    onDateFromChange,
    onDateToChange,
    inputFromProps = {},
    inputToProps = {},
    offDays,
    events,
    dataTestId,
}) => {
    const [inputFromValue, setInputFromValue] = useState<string>(valueFrom);
    const [inputToValue, setInputToValue] = useState<string>(valueTo);

    /**
     * Ключ для сброса календарей
     * Пользователь открыл календарь, изменил месяц, но ничего не выбрал
     * — при следующем открытии в календаре будет установлен начальный месяц
     */
    const [resetKey, setResetKey] = useState<number>(0);

    const dateFrom = isValidInputValue(inputFromValue, minDate, maxDate, offDays)
        ? parseDateString(inputFromValue).getTime()
        : null;

    const dateTo = isValidInputValue(inputToValue, dateFrom || minDate, maxDate, offDays)
        ? parseDateString(inputToValue).getTime()
        : null;

    const [inputFromInvalid, setInputFromInvalid] = useState<boolean>(
        isCompleteDateInput(inputFromValue) && dateFrom === null,
    );
    const [inputToInvalid, setInputToInvalid] = useState<boolean>(
        isCompleteDateInput(inputToValue) && dateTo === null,
    );

    const bothInvalid =
        isCompleteDateInput(inputFromValue) &&
        isCompleteDateInput(inputToValue) &&
        parseDateString(inputFromValue).getTime() > parseDateString(inputToValue).getTime();

    const {
        monthFrom,
        monthTo,
        handleMonthFromChange,
        handleMonthToChange,
    } = usePopoverViewMonthes({
        dateFrom,
        dateTo,
        defaultMonth,
        resetKey,
    });

    const handleValidInputFrom = useCallback(() => {
        setInputFromInvalid(
            inputFromValue !== '' && !isValidInputValue(inputFromValue, minDate, maxDate, offDays),
        );
    }, [inputFromValue, maxDate, minDate, offDays]);

    const handleValidInputTo = useCallback(() => {
        setInputToInvalid(
            inputToValue !== '' &&
                !isValidInputValue(inputToValue, dateFrom || minDate, maxDate, offDays),
        );
    }, [dateFrom, inputToValue, maxDate, minDate, offDays]);

    const handleInputFromChange: Required<CalendarInputProps>['onInputChange'] = useCallback(
        (_, payload) => {
            setInputFromValue(payload.value);
        },
        [],
    );

    const handleInputToChange: Required<CalendarInputProps>['onInputChange'] = useCallback(
        (_, payload) => {
            setInputToValue(payload.value);
        },
        [],
    );

    const handleInputFromBlur = useCallback(() => {
        handleValidInputFrom();
        setResetKey(+new Date());
    }, [handleValidInputFrom]);

    const handleInputToBlur = useCallback(() => {
        handleValidInputTo();
        setResetKey(+new Date());
    }, [handleValidInputTo]);

    const handleFromChange: Required<CalendarInputProps>['onChange'] = useCallback((_, payload) => {
        setInputFromValue(payload.value);
    }, []);

    const handleToChange: Required<CalendarInputProps>['onChange'] = useCallback((_, payload) => {
        setInputToValue(payload.value);
    }, []);

    useEffect(() => {
        setInputFromValue(valueFrom);
    }, [valueFrom]);

    useEffect(() => {
        setInputToValue(valueTo);
    }, [valueTo]);

    useEffect(() => {
        if (onDateFromChange) onDateFromChange({ value: inputFromValue, date: dateFrom });

        if (!inputFromValue || isCompleteDateInput(inputFromValue)) {
            handleValidInputFrom();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputFromValue]);

    useEffect(() => {
        if (onDateToChange) onDateToChange({ value: inputToValue, date: dateTo });

        if (!inputToValue || isCompleteDateInput(inputToValue)) {
            handleValidInputTo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputToValue]);

    return (
        <div className={cn(styles.component, className)} data-test-id={dataTestId}>
            <CalendarInput
                {...inputFromProps}
                useAnchorWidth={false}
                calendarPosition='popover'
                popoverPosition='bottom-start'
                error={inputFromInvalid || bothInvalid}
                onChange={handleFromChange}
                onInputChange={handleInputFromChange}
                onBlur={handleInputFromBlur}
                value={inputFromValue}
                minDate={minDate}
                maxDate={maxDate}
                offDays={offDays}
                events={events}
                calendarProps={{
                    ...inputFromProps.calendarProps,
                    month: monthFrom,
                    onMonthChange: handleMonthFromChange,
                    selectorView: 'full',
                }}
            />

            <span className={styles.divider} />

            <CalendarInput
                {...inputToProps}
                useAnchorWidth={false}
                calendarPosition='popover'
                popoverPosition='bottom-end'
                error={inputToInvalid || bothInvalid}
                onChange={handleToChange}
                onInputChange={handleInputToChange}
                onBlur={handleInputToBlur}
                value={inputToValue}
                minDate={dateFrom || minDate}
                maxDate={maxDate}
                offDays={offDays}
                events={events}
                calendarProps={{
                    ...inputToProps.calendarProps,
                    month: monthTo,
                    onMonthChange: handleMonthToChange,
                    selectorView: 'full',
                }}
            />
        </div>
    );
};
