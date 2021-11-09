/* eslint-disable multiline-comment-style */
import React, { useCallback, useState, MouseEvent, FC } from 'react';
import cn from 'classnames';
import { startOfMonth, subMonths } from 'date-fns';
import { usePeriod, dateInLimits } from '@alfalab/core-components-calendar';
import {
    CalendarInput,
    CalendarInputProps,
    formatDate,
    parseDateString,
} from '@alfalab/core-components-calendar-input';
import {
    isDayButton,
    ValueState,
    getCorrectValueState,
    initialValueState,
    PickPeriod,
} from './utils';

import { useCalendarMonthes } from './useCalendarMonthes';
import { useCalendarMaxMinDates } from './useCalendarMaxMinDates';

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

    /**
     * Определяет, как рендерить календарь — в поповере или снизу инпута
     */
    calendarPosition?: 'static' | 'popover';

    /**
     * Если выбран in-future - будут оторбражаться текущий месяц и следующий
     * Если выбран in-past - будут оторбражаться текущий месяц и прошлый
     */
    pickPeriod?: PickPeriod;
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
    calendarPosition = 'static',
    dataTestId,
    pickPeriod = 'in-past',
}) => {
    const uncontrolled = valueFrom === undefined && valueTo === undefined;
    const isPopover = calendarPosition === 'popover';

    const period = usePeriod({
        initialSelectedFrom: valueFrom ? parseDateString(valueFrom).getTime() : undefined,
        initialSelectedTo: valueTo ? parseDateString(valueTo).getTime() : undefined,
    });

    const { setStart, setEnd, resetPeriod } = period;
    let { selectedFrom, selectedTo } = period;

    if (!dateInLimits(selectedFrom, minDate, maxDate)) selectedFrom = undefined;
    if (!dateInLimits(selectedTo, minDate, maxDate)) selectedTo = undefined;

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

    const { monthFrom, monthTo, handleMonthFromChange, handleMonthToChange } = useCalendarMonthes({
        inputValueFrom,
        inputValueTo,
        defaultMonth,
        isPopover,
        pickPeriod,
    });

    const handleInputFromChange = useCallback<Required<CalendarInputProps>['onInputChange']>(
        (_, { value, date }) => {
            if (value === '') {
                setStart(undefined);
                handleStateFromChange(initialValueState);
            }

            if (dateInLimits(date, minDate, maxDate)) {
                setStart(date.getTime());
                handleMonthFromChange(startOfMonth(date).getTime());
                handleStateFromChange({ date: date.getTime(), value });
            } else {
                setStart(undefined);
                handleStateFromChange({ date: null, value });
            }
        },
        [handleMonthFromChange, handleStateFromChange, maxDate, minDate, setStart],
    );

    const handleInputToChange = useCallback<Required<CalendarInputProps>['onInputChange']>(
        (_, { value, date }) => {
            if (value === '') {
                setEnd(undefined);
                handleStateToChange(initialValueState);
            }

            if (dateInLimits(date, minDate, maxDate)) {
                setEnd(date.getTime());
                handleMonthToChange(subMonths(startOfMonth(date), 1).getTime());
                handleStateToChange({ date: date.getTime(), value });
            } else {
                setEnd(undefined);
                handleStateToChange({ date: null, value });
            }
        },
        [handleMonthToChange, handleStateToChange, maxDate, minDate, setEnd],
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

            if (date === inputValueFrom.date && date === inputValueTo.date) {
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
            inputValueTo.date,
            handleStateToChange,
            setEnd,
            setStart,
            handleStateFromChange,
            resetPeriod,
        ],
    );

    const handleFromCalendarChange = useCallback(
        (date: number) => {
            if (!isPopover) {
                handleCalendarChange(date);

                return;
            }

            setStart(date);
            handleStateFromChange({ date, value: formatDate(date) });
        },
        [handleCalendarChange, handleStateFromChange, isPopover, setStart],
    );

    const handleToCalendarChange = useCallback(
        (date: number) => {
            if (!isPopover) {
                handleCalendarChange(date);

                return;
            }

            handleStateToChange({ date, value: formatDate(date) });
            setEnd(date);
        },
        [handleCalendarChange, handleStateToChange, isPopover, setEnd],
    );

    const [nextMonthHighlighted, setNextMonthHighlighted] = useState(false);

    const handleCalendarToMouseOver = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            const target = event.target as HTMLElement;

            const dayHighlighted = isDayButton(target) || isDayButton(target.parentElement);

            if (nextMonthHighlighted && !dayHighlighted) setNextMonthHighlighted(false);
            if (!nextMonthHighlighted && dayHighlighted) setNextMonthHighlighted(true);
        },
        [nextMonthHighlighted],
    );

    const selectorView = isPopover ? 'full' : 'month-only';
    const calendarSelectedTo = selectedTo || (nextMonthHighlighted ? monthTo : undefined);
    const maxMinDates = useCalendarMaxMinDates({
        isPopover,
        monthTo,
        monthFrom,
        selectedFrom,
        selectedTo: calendarSelectedTo,
        maxDate,
        minDate,
    });

    return (
        <div className={cn(styles.component, className)} data-test-id={dataTestId}>
            <CalendarInput
                {...inputFromProps}
                calendarPosition={calendarPosition}
                onInputChange={handleInputFromChange}
                onCalendarChange={handleFromCalendarChange}
                value={inputValueFrom.value}
                minDate={maxMinDates.fromMinDate}
                maxDate={maxMinDates.fromMaxDate}
                calendarProps={{
                    ...inputFromProps.calendarProps,
                    month: monthFrom,
                    onMonthChange: handleMonthFromChange,
                    selectorView,
                    selectedFrom,
                    selectedTo: calendarSelectedTo,
                }}
            />

            <span className={styles.divider} />

            {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
            <div onMouseOver={handleCalendarToMouseOver}>
                <CalendarInput
                    {...inputToProps}
                    calendarPosition={calendarPosition}
                    popoverPosition='bottom-end'
                    onInputChange={handleInputToChange}
                    onCalendarChange={handleToCalendarChange}
                    value={inputValueTo.value}
                    minDate={maxMinDates.toMinDate}
                    maxDate={maxMinDates.toMaxDate}
                    calendarProps={{
                        ...inputToProps.calendarProps,
                        month: monthTo,
                        onMonthChange: handleMonthToChange,
                        selectorView,
                        selectedFrom,
                        selectedTo,
                    }}
                />
            </div>
        </div>
    );
};
