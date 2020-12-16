/* eslint-disable multiline-comment-style */
import React, { useCallback, useState, MouseEvent, FC } from 'react';
import cn from 'classnames';
import { startOfMonth, subMonths, addMonths, endOfMonth } from 'date-fns';
import { usePeriod, dateInLimits, limitDate } from '@alfalab/core-components-calendar';
import {
    CalendarInput,
    CalendarInputProps,
    formatDate,
    isCompleteDateInput,
    parseDateString,
} from '@alfalab/core-components-calendar-input';
import { isDayButton, ValueState, getCorrectValueState, initialValueState } from './utils';

import styles from './index.module.css';

export type CalendarRangeProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Значение инпута (используется и для календаря)
     */
    valueFrom?: string;

    /**
     * Значение инпута (используется и для календаря)
     */
    valueTo?: string;

    /**
     * Месяц в календаре по умолчанию
     */
    defaultMonth?: number;

    /**
     * Минимальная дата, доступная для выбора (timestamp)
     */
    minDate?: number;

    /**
     * Максимальная дата, доступная для выбора (timestamp)
     */
    maxDate?: number;

    /**
     * Обработчик изменения даты от
     */
    onDateFromChange?: (payload: ValueState) => void;

    /**
     * Обработчик изменения даты до
     */
    onDateToChange?: (payload: ValueState) => void;

    /**
     * Пропсы для инпута даты от
     */
    inputFromProps?: CalendarInputProps;

    /**
     * Пропсы для инпута даты до
     */
    inputToProps?: CalendarInputProps;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const CalendarRange: FC<CalendarRangeProps> = ({
    className,
    defaultMonth = startOfMonth(new Date()).getTime(),
    minDate,
    maxDate,
    valueFrom,
    valueTo,
    onDateFromChange,
    onDateToChange,
    inputFromProps = {},
    inputToProps = {},
    dataTestId,
}) => {
    const uncontrolled = valueFrom === undefined && valueTo === undefined;

    const period = usePeriod({
        initialSelectedFrom: valueFrom ? parseDateString(valueFrom).getTime() : undefined,
        initialSelectedTo: valueTo ? parseDateString(valueTo).getTime() : undefined,
    });

    const { setStart, setEnd, resetPeriod } = period;
    let { selectedFrom, selectedTo } = period;

    if (!dateInLimits(selectedFrom, minDate, maxDate)) selectedFrom = undefined;
    if (!dateInLimits(selectedTo, minDate, maxDate)) selectedTo = undefined;

    const [nextMonthHighlighted, setNextMonthHighlighted] = useState(false);

    const initialMonth =
        uncontrolled || !valueFrom
            ? defaultMonth
            : startOfMonth(parseDateString(valueFrom)).getTime();

    const [month, setMonth] = useState(initialMonth);
    const monthTo = addMonths(month, 1).getTime();

    const [stateFrom, setStateFrom] = useState<ValueState>(initialValueState);
    const [stateTo, setStateTo] = useState<ValueState>(initialValueState);

    const inputValueFrom = getCorrectValueState(stateFrom, valueFrom, minDate, maxDate);
    const inputValueTo = getCorrectValueState(stateTo, valueTo, minDate, maxDate);

    const handleStateFromChange = useCallback(
        (newFromState: ValueState) => {
            if (uncontrolled) setStateFrom(newFromState);
            if (onDateFromChange) onDateFromChange(newFromState);
        },
        [onDateFromChange, uncontrolled],
    );

    const handleStateToChange = useCallback(
        (newToState: ValueState) => {
            if (uncontrolled) setStateTo(newToState);
            if (onDateToChange) onDateToChange(newToState);
        },
        [onDateToChange, uncontrolled],
    );

    const handleInputFromChange = useCallback<Required<CalendarInputProps>['onInputChange']>(
        (_, { value, date }) => {
            if (value === '') {
                setStart(undefined);
                handleStateFromChange(initialValueState);
            }

            if (isCompleteDateInput(value)) {
                if (dateInLimits(date, minDate, maxDate)) {
                    setStart(date.getTime());
                    setMonth(startOfMonth(date).getTime());
                    handleStateFromChange({ date: date.getTime(), value });
                } else {
                    setStart(undefined);
                    handleStateFromChange({ date: null, value });
                }
            }
        },
        [handleStateFromChange, maxDate, minDate, setStart],
    );

    const handleInputToChange = useCallback<Required<CalendarInputProps>['onInputChange']>(
        (_, { value, date }) => {
            if (value === '') {
                setEnd(undefined);
                handleStateToChange(initialValueState);
            }

            if (isCompleteDateInput(value)) {
                if (dateInLimits(date, minDate, maxDate)) {
                    setEnd(date.getTime());
                    setMonth(subMonths(startOfMonth(date), 1).getTime());
                    handleStateToChange({ date: date.getTime(), value });
                } else {
                    setEnd(undefined);
                    handleStateToChange({ date: null, value });
                }
            }
        },
        [handleStateToChange, maxDate, minDate, setEnd],
    );

    const handleCalendarChange = useCallback(
        (date: number) => {
            if (!inputValueFrom.date) {
                setStart(date);
                handleStateFromChange({ date, value: formatDate(date) });

                return;
            }

            if (date < inputValueFrom.date) {
                resetPeriod();
                setStart(date);
                handleStateToChange(initialValueState);
                handleStateFromChange({ date, value: formatDate(date) });

                return;
            }

            if (date === inputValueFrom.date) {
                resetPeriod();
                handleStateFromChange(initialValueState);
                handleStateToChange(initialValueState);

                return;
            }

            handleStateToChange({ date, value: formatDate(date) });
            setEnd(date);
        },
        [
            inputValueFrom.date,
            handleStateToChange,
            setEnd,
            setStart,
            handleStateFromChange,
            resetPeriod,
        ],
    );

    const handleMonthFromChange = useCallback((value: number) => {
        setMonth(value);
    }, []);

    const handleMonthToChange = useCallback((value: number) => {
        setMonth(subMonths(value, 1).getTime());
    }, []);

    const handleCalendarToMouseOver = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            const target = event.target as HTMLElement;

            const dayHighlighted = isDayButton(target) || isDayButton(target.parentElement);

            if (nextMonthHighlighted && !dayHighlighted) setNextMonthHighlighted(false);
            if (!nextMonthHighlighted && dayHighlighted) setNextMonthHighlighted(true);
        },
        [nextMonthHighlighted],
    );

    return (
        <div className={cn(styles.component, className)} data-test-id={dataTestId}>
            <CalendarInput
                {...inputFromProps}
                calendarPosition='static'
                onInputChange={handleInputFromChange}
                onCalendarChange={handleCalendarChange}
                value={inputValueFrom.value}
                minDate={minDate}
                maxDate={limitDate(endOfMonth(month), minDate, maxDate).getTime()}
                calendarProps={{
                    ...inputFromProps.calendarProps,
                    month,
                    onMonthChange: handleMonthFromChange,
                    selectorView: 'month-only',
                    selectedFrom,
                    selectedTo: selectedTo || (nextMonthHighlighted ? monthTo : undefined),
                }}
            />

            <span className={styles.divider} />

            {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
            <div onMouseOver={handleCalendarToMouseOver}>
                <CalendarInput
                    {...inputToProps}
                    calendarPosition='static'
                    onInputChange={handleInputToChange}
                    onCalendarChange={handleCalendarChange}
                    value={inputValueTo.value}
                    minDate={limitDate(startOfMonth(monthTo), minDate, maxDate).getTime()}
                    maxDate={maxDate}
                    calendarProps={{
                        ...inputToProps.calendarProps,
                        month: monthTo,
                        onMonthChange: handleMonthToChange,
                        selectorView: 'month-only',
                        selectedFrom,
                        selectedTo,
                    }}
                />
            </div>
        </div>
    );
};
