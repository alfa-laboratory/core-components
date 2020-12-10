/* eslint-disable multiline-comment-style */
import React, { useCallback, useState, MouseEvent, FC } from 'react';
import cn from 'classnames';
import { startOfMonth, subMonths, addMonths, endOfMonth } from 'date-fns';
import { MaskedInputProps } from '@alfalab/core-components-masked-input';
import { usePeriod } from '@alfalab/core-components-calendar';
import {
    CalendarInput,
    CalendarInputProps,
    formatDate,
    isCompleteDateInput,
    parseDateString,
} from '@alfalab/core-components-calendar-input';
import { isDayButton } from './utils';

import styles from './index.module.css';

export type CalendarRangeProps = Omit<
    MaskedInputProps,
    'mask' | 'value' | 'onChange' | 'clear' | 'onClear' | 'rightAddons' | 'onBeforeDisplay'
> & {
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
     * Обработчик изменения даты от
     */
    onDateFromChange?: (payload: ValueState) => void;

    /**
     * Обработчик изменения даты до
     */
    onDateToChange?: (payload: ValueState) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

type ValueState = {
    date: number | null;
    value: string;
};

const initialValueState = { date: null, value: '' };

export const CalendarRange: FC<CalendarRangeProps> = ({
    block = false,
    className,
    defaultMonth = startOfMonth(new Date()).getTime(),
    valueFrom,
    valueTo,
    onDateFromChange,
    onDateToChange,
    dataTestId,
}) => {
    const uncontrolled = valueFrom === undefined && valueTo === undefined;

    const { selectedFrom, selectedTo, updatePeriod, setStart, setEnd, resetPeriod } = usePeriod({
        initialSelectedFrom: valueFrom ? parseDateString(valueFrom).getTime() : undefined,
        initialSelectedTo: valueTo ? parseDateString(valueTo).getTime() : undefined,
    });

    const [nextMonthHighlighted, setNextMonthHighlighted] = useState(false);

    const initialMonth =
        uncontrolled || !valueFrom
            ? defaultMonth
            : startOfMonth(parseDateString(valueFrom)).getTime();

    const [month, setMonth] = useState(initialMonth);
    const monthTo = addMonths(month, 1).getTime();

    const [stateFrom, setStateFrom] = useState<ValueState>(initialValueState);
    const [stateTo, setStateTo] = useState<ValueState>(initialValueState);

    const inputValueFrom: ValueState =
        valueFrom === undefined
            ? stateFrom
            : { value: valueFrom, date: parseDateString(valueFrom as string).getTime() };

    const inputValueTo: ValueState =
        valueTo === undefined
            ? stateTo
            : { value: valueTo, date: parseDateString(valueTo as string).getTime() };

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

            if (date && isCompleteDateInput(value)) {
                setStart(date.getTime());
                setMonth(startOfMonth(date).getTime());
                handleStateFromChange({ date: date.getTime(), value });
            }
        },
        [handleStateFromChange, setStart],
    );

    const handleInputToChange = useCallback<Required<CalendarInputProps>['onInputChange']>(
        (_, { value, date }) => {
            if (value === '') {
                setEnd(undefined);
                handleStateToChange(initialValueState);
            }

            if (date && isCompleteDateInput(value)) {
                setEnd(date.getTime());
                setMonth(subMonths(startOfMonth(date), 1).getTime());
                handleStateToChange({ date: date.getTime(), value });
            }
        },
        [handleStateToChange, setEnd],
    );

    const handleCalendarChange = useCallback(
        (date: number) => {
            if (!inputValueFrom.date || date < inputValueFrom.date) {
                setStart(date);

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

            updatePeriod(date);
        },
        [
            inputValueFrom.date,
            handleStateToChange,
            handleStateFromChange,
            updatePeriod,
            setStart,
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
        <div
            className={cn(styles.component, className, {
                [styles.block]: block,
            })}
            data-test-id={dataTestId}
        >
            <CalendarInput
                calendarPosition='static'
                onInputChange={handleInputFromChange}
                onCalendarChange={handleCalendarChange}
                value={inputValueFrom.value}
                calendarProps={{
                    month,
                    maxDate: endOfMonth(month).getTime(),
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
                    calendarPosition='static'
                    onInputChange={handleInputToChange}
                    onCalendarChange={handleCalendarChange}
                    value={inputValueTo.value}
                    calendarProps={{
                        month: monthTo,
                        minDate: startOfMonth(monthTo).getTime(),
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
